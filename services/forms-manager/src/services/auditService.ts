import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase/firebase';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { NistAudit, AuditResult, OptionValue } from '../schemas/formSchema';
import {
	AuditTemplateNotFoundError,
	AuditResultNotFoundError,
	FirebaseOperationError,
	InvalidAuditDataError,
	logAuditError,
} from '../utils/auditErrors';
import {
	RESPONSE_SCORES,
	RISK_LEVELS,
	FIRESTORE_COLLECTIONS,
	NIST_TEMPLATE_ID,
} from '../constants/auditConstants';

export class AuditService {
	// Puntajes asignados a cada tipo de respuesta desde las constantes
	private static RESPONSE_SCORES: Record<OptionValue, number> = RESPONSE_SCORES;

	// Cargar la plantilla de auditoría NIST desde Firestore o usar la predeterminada
	static async getAuditTemplate(): Promise<NistAudit> {
		try {
			const docRef = doc(
				db,
				FIRESTORE_COLLECTIONS.AUDIT_TEMPLATES,
				NIST_TEMPLATE_ID
			);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log('Plantilla de auditoría encontrada en Firestore');
				return docSnap.data() as NistAudit;
			} else {
				console.warn(
					'Plantilla de auditoría no encontrada en Firestore, usando plantilla predeterminada'
				);
			}
		} catch (error) {
			logAuditError('getAuditTemplate', error);
			throw new FirebaseOperationError('obtener plantilla de auditoría');
		}

		// Plantilla predeterminada como fallback
		try {
			const defaultTemplate = JSON.parse(
				process.env.DEFAULT_NIST_TEMPLATE || '{}'
			) as NistAudit;
			if (!defaultTemplate.program) {
				throw new AuditTemplateNotFoundError();
			}
			return defaultTemplate;
		} catch (error) {
			logAuditError('getAuditTemplate (default template)', error);
			throw new AuditTemplateNotFoundError();
		}
	}

	// Guardar resultados de auditoría en Firestore
	static async saveAuditResult(auditResult: AuditResult): Promise<string> {
		console.log('Guardando resultado de auditoría');
		try {
			if (
				!auditResult ||
				!auditResult.sections ||
				!auditResult.completionPercentage
			) {
				throw new InvalidAuditDataError('Datos de auditoría incompletos');
			}

			const id = auditResult.id || uuidv4();
			const auditWithId = {
				...auditResult,
				id,
				createdAt: Date.now(),
			};

			await setDoc(
				doc(db, FIRESTORE_COLLECTIONS.AUDIT_RESULTS, id),
				auditWithId
			);
			return `Resultado de auditoría guardado con ID: ${id}`;
		} catch (error) {
			logAuditError('saveAuditResult', error);
			if (error instanceof InvalidAuditDataError) {
				throw error;
			}
			throw new FirebaseOperationError('guardar resultado de auditoría');
		}
	}

	// Obtener un resultado de auditoría específico
	static async getAuditResult(id: string): Promise<AuditResult> {
		console.log(`Obteniendo resultado de auditoría con ID: ${id}`);
		try {
			const docRef = doc(db, FIRESTORE_COLLECTIONS.AUDIT_RESULTS, id);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log('Resultado de auditoría encontrado');
				return docSnap.data() as AuditResult;
			}

			console.warn(`Resultado de auditoría con ID ${id} no encontrado`);
			throw new AuditResultNotFoundError(id);
		} catch (error) {
			logAuditError('getAuditResult', error);
			if (error instanceof AuditResultNotFoundError) {
				throw error;
			}
			throw new FirebaseOperationError('obtener resultado de auditoría');
		}
	}

	// Calcular el porcentaje de cumplimiento y nivel de riesgo
	static calculateComplianceAndRisk(audit: NistAudit): {
		completionPercentage: number;
		sectionResults: Record<string, number>;
	} {
		try {
			let totalScore = 0;
			let totalQuestions = 0;
			const sectionResults: Record<string, number> = {};

			// Calcular por sección
			for (const section of audit.sections) {
				let sectionScore = 0;
				let sectionQuestions = 0;

				for (const subsection of section.subsections) {
					for (const question of subsection.questions) {
						if (question.response) {
							const score = AuditService.RESPONSE_SCORES[question.response];
							sectionScore += score;
							totalScore += score;
							sectionQuestions++;
							totalQuestions++;
						}
					}
				}

				if (sectionQuestions > 0) {
					sectionResults[section.section] = sectionScore / sectionQuestions;
				} else {
					sectionResults[section.section] = 0;
				}
			}

			const completionPercentage =
				totalQuestions > 0 ? totalScore / totalQuestions : 0;

			console.log(
				`Cálculo completado: Cumplimiento ${completionPercentage.toFixed(2)}%`
			);
			return { completionPercentage, sectionResults };
		} catch (error) {
			logAuditError('calculateComplianceAndRisk', error);
			if (error instanceof InvalidAuditDataError) {
				throw error;
			}
			throw new InvalidAuditDataError(
				'Error al calcular el cumplimiento y nivel de riesgo'
			);
		}
	}

	// Preparar objeto de resultado de auditoría para guardar
	static prepareAuditResultObject(audit: NistAudit): AuditResult {
		try {
			if (!audit || !audit.sections || !audit.program) {
				throw new InvalidAuditDataError(
					'Datos de auditoría incompletos o inválidos'
				);
			}

			const { completionPercentage, sectionResults } =
				AuditService.calculateComplianceAndRisk(audit);

			const sections: AuditResult['sections'] = {};

			// Extraer respuestas por sección
			for (const section of audit.sections) {
				const sectionQuestions: Record<
					string,
					{
						response: OptionValue | null;
						observations: string;
						evidence_url: string;
					}
				> = {};

				for (const subsection of section.subsections) {
					for (const question of subsection.questions) {
						sectionQuestions[question.id] = {
							response: question.response,
							observations: question.observations,
							evidence_url: question.evidence_url,
						};
					}
				}

				sections[section.section] = {
					completionPercentage: sectionResults[section.section],
					questions: sectionQuestions,
				};
			}

			const result = {
				id: uuidv4(),
				program: audit.program,
				auditDate: new Date().toISOString(),
				completionPercentage,
				sections,
			};

			console.log('Objeto de resultado de auditoría preparado correctamente');
			return result;
		} catch (error) {
			logAuditError('prepareAuditResultObject', error);
			if (error instanceof InvalidAuditDataError) {
				throw error;
			}
			throw new InvalidAuditDataError(
				'Error al procesar los datos de auditoría'
			);
		}
	}

	// Actualizar un resultado de auditoría existente
	static async updateAuditResult(
		id: string,
		auditResult: Partial<AuditResult>
	): Promise<string> {
		console.log(`Actualizando resultado de auditoría con ID: ${id}`);
		try {
			// Verificar que el ID existe
			const docRef = doc(db, FIRESTORE_COLLECTIONS.AUDIT_RESULTS, id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				console.warn(`Resultado de auditoría con ID ${id} no encontrado`);
				throw new AuditResultNotFoundError(id);
			}

			// Obtener los datos actuales
			const currentData = docSnap.data() as AuditResult;

			// Preparar los datos actualizados
			const updatedData = {
				...currentData,
				...auditResult,
				updatedAt: Date.now(),
			};

			// Validar datos
			if (!updatedData.sections || !updatedData.completionPercentage) {
				throw new InvalidAuditDataError('Datos de auditoría incompletos');
			}

			// Guardar los cambios
			await setDoc(docRef, updatedData);
			return `Resultado de auditoría actualizado con ID: ${id}`;
		} catch (error) {
			logAuditError('updateAuditResult', error);
			if (
				error instanceof AuditResultNotFoundError ||
				error instanceof InvalidAuditDataError
			) {
				throw error;
			}
			throw new FirebaseOperationError('actualizar resultado de auditoría');
		}
	}

	// Obtener todos los formularios de auditoría
	static async getForms(): Promise<NistAudit[]> {
		console.log('Obteniendo todos los formularios de auditoría');
		try {
			const formsCollection = collection(db, 'audit-results');
			const querySnapshot = await getDocs(formsCollection);

			const forms: NistAudit[] = [];
			querySnapshot.forEach((doc) => {
				forms.push(doc.data() as NistAudit);
			});

			console.log(`Se encontraron ${forms.length} formularios de auditoría`);
			return forms;
		} catch (error) {
			logAuditError('getForms', error);
			throw new FirebaseOperationError('obtener formularios de auditoría');
		}
	}
}
