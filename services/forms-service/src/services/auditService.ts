import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase/firebase';
import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	deleteDoc,
} from 'firebase/firestore';
import { NistAudit, AuditResult, OptionValue } from '../schemas/formSchema';
import {
	AuditResultNotFoundError,
	FirebaseOperationError,
	InvalidAuditDataError,
	logAuditError,
} from '../utils/auditErrors';
import { RESPONSE_SCORES } from '../constants/auditConstants';

export class AuditService {
	// Puntajes asignados a cada tipo de respuesta desde las constantes
	private static RESPONSE_SCORES: Record<OptionValue, number> = RESPONSE_SCORES;

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
				createdAt: new Date(),
			};

			await setDoc(doc(db, 'audit-results', id), auditWithId);
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
	static async getAuditResult(id: string): Promise<AuditResult & { sectionTitles?: { [key: string]: string } }> {
		console.log(`Obteniendo resultado de auditoría con ID: ${id}`);
		try {
			const docRef = doc(db, 'audit-results', id);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log('Resultado de auditoría encontrado');
				const auditResult = docSnap.data() as AuditResult;
				
				// Agregar un campo adicional con los títulos de las secciones para facilitar el acceso
				const sectionTitles: { [key: string]: string } = {};
				if (auditResult.sections) {
					Object.entries(auditResult.sections).forEach(([sectionId, sectionData]) => {
						sectionTitles[sectionId] = sectionData.title;
					});
				}
				
				return {
					...auditResult,
					sectionTitles
				};
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

	// Eliminar un resultado de auditoría por su ID
	static async deleteAuditResult(id: string): Promise<void> {
		console.log(`Eliminando resultado de auditoría con ID: ${id}`);
		try {
			// Verificar que el ID existe
			const docRef = doc(db, 'audit-results', id);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				console.warn(`Resultado de auditoría con ID ${id} no encontrado`);
				throw new AuditResultNotFoundError(id);
			}

			// Eliminar el documento
			await deleteDoc(docRef);
			console.log(
				`Resultado de auditoría con ID ${id} eliminado correctamente`
			);
		} catch (error) {
			logAuditError('deleteAuditResult', error);
			if (error instanceof AuditResultNotFoundError) {
				throw error;
			}
			throw new FirebaseOperationError('eliminar resultado de auditoría');
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
						text: string;
						response: OptionValue | null;
						observations: string;
						evidence_url: string;
					}
				> = {};

				for (const subsection of section.subsections) {
					for (const question of subsection.questions) {
						sectionQuestions[question.id] = {
							text: question.text,
							response: question.response,
							observations: question.observations,
							evidence_url: question.evidence_url,
						};
					}
				}

				sections[section.section] = {
					title: section.title,
					completionPercentage: sectionResults[section.section],
					questions: sectionQuestions,
				};
			}

			const result = {
				id: uuidv4(),
				program: audit.program,
				auditDate: new Date(),
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
			const docRef = doc(db, 'audit-results', id);
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

	// Obtener todos los formularios de auditoría (ID, nombre y títulos de secciones)
	static async getForms(): Promise<{ id: string; name: string; sections?: { [key: string]: { title: string } } }[]> {
		console.log('Obteniendo todos los formularios de auditoría');
		try {
			const formsCollection = collection(db, 'audit-results');
			const querySnapshot = await getDocs(formsCollection);

			const forms: { id: string; name: string; sections?: { [key: string]: { title: string } } }[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data() as AuditResult;
				const sectionTitles: { [key: string]: { title: string } } = {};
				
				// Extraer solo los títulos de las secciones
				if (data.sections) {
					Object.entries(data.sections).forEach(([sectionId, sectionData]) => {
						sectionTitles[sectionId] = { title: sectionData.title };
					});
				}
				
				forms.push({
					id: doc.id,
					name: data.program,
					sections: sectionTitles
				});
			});

			console.log(`Se encontraron ${forms.length} formularios de auditoría`);
			return forms;
		} catch (error) {
			logAuditError('getForms', error);
			throw new FirebaseOperationError('obtener formularios de auditoría');
		}
	}
}
