import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditService } from '../../../src/services/auditService';
import {
	NistAudit,
	AuditResult,
	OptionValue,
} from '../../../src/schemas/formSchema';
import {
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	deleteDoc,
	query,
	where,
} from 'firebase/firestore';

// Manually mock Firebase functions
vi.mock('firebase/firestore', () => {
	return {
		collection: vi.fn(),
		doc: vi.fn(() => 'mocked-doc-reference'),
		setDoc: vi.fn(),
		getDoc: vi.fn(),
		getDocs: vi.fn(),
		deleteDoc: vi.fn(),
		query: vi.fn(),
		where: vi.fn(),
	};
});

vi.mock('../../../src/firebase/firebase', () => {
	return {
		db: {},
	};
});

vi.mock('uuid', () => {
	return {
		v4: () => 'mocked-uuid',
	};
});

describe('AuditService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('prepareAuditResultObject', () => {
		it('should create a valid audit result object with correct completion percentage', () => {
			// Create a sample audit object
			const mockAudit: NistAudit = {
				program: 'Test Program',
				sections: [
					{
						section: 'sec1',
						title: 'Section 1',
						subsections: [
							{
								subsection: 'sub1',
								title: 'Subsection 1',
								questions: [
									{
										id: 'q1',
										text: 'Question 1',
										options: [],
										response: 'yes',
										observations: 'Observation 1',
										evidence_url: '',
									},
									{
										id: 'q2',
										text: 'Question 2',
										options: [],
										response: 'partial',
										observations: 'Observation 2',
										evidence_url: '',
									},
								],
							},
						],
					},
				],
			};

			const result = AuditService.prepareAuditResultObject(mockAudit);

			// Verify the structure and values of the result
			expect(result).toBeDefined();
			expect(result.program).toBe('Test Program');

			// Check if the completion percentage is calculated correctly
			expect(result.completionPercentage).toBeGreaterThan(0);
			expect(result.completionPercentage).toBeLessThanOrEqual(100);

			// Validate that sections are properly transferred
			expect(Object.keys(result.sections).length).toBeGreaterThan(0);
			expect(Object.values(result.sections)[0].questions).toBeDefined();
		});

		it('should handle empty sections gracefully', () => {
			const emptyAudit: NistAudit = {
				program: 'Empty Program',
				sections: [],
			};

			const result = AuditService.prepareAuditResultObject(emptyAudit);

			expect(result.completionPercentage).toBe(0);
			expect(Object.keys(result.sections).length).toBe(0);
		});
	});

	describe('saveAuditResult', () => {
		it('should save an audit result and return the ID', async () => {
			// Setup mock for setDoc to resolve
			vi.mocked(setDoc).mockResolvedValue(undefined);

			const mockAuditResult: AuditResult = {
				id: 'test-id',
				program: 'Test Program',
				auditDate: new Date(),
				completionPercentage: 75,
				sections: {
					section1: {
						title: 'Test Section',
						completionPercentage: 75,
						questions: {
							q1: {
								text: 'Test Question',
								response: 'yes',
								observations: 'Test observation',
								evidence_url: '',
							},
						},
					},
				},
			};

			const result = await AuditService.saveAuditResult(mockAuditResult);

			// Verify the result contains the ID
			expect(result).toContain('test-id');

			// Check that setDoc was called correctly
			expect(setDoc).toHaveBeenCalledTimes(1);
		});

		it('should throw an error when audit data is invalid', async () => {
			const invalidAudit: AuditResult = {
				id: 'invalid-audit',
				program: 'Invalid Program',
				auditDate: new Date(),
				completionPercentage: 0,
				sections: {}, // Empty sections object should still trigger validation error
			};

			await expect(
				AuditService.saveAuditResult(invalidAudit)
			).rejects.toThrow();
		});
	});

	describe('getAuditResult', () => {
		it('should retrieve an audit result by ID', async () => {
			// Mock the document data
			const mockAuditData = {
				id: 'test-id',
				program: 'Test Program',
				auditDate: new Date('2025-05-21'),
				completionPercentage: 75,
				sections: {},
			};

			// Setup getDoc to return the mock data
			vi.mocked(getDoc).mockResolvedValue({
				exists: () => true,
				data: () => mockAuditData,
			} as any);

			const result = await AuditService.getAuditResult('test-id');

			expect(result).toMatchObject(mockAuditData);
			expect(getDoc).toHaveBeenCalledTimes(1);
		});

		it('should throw an error if audit result is not found', async () => {
			// Setup getDoc to return no data
			vi.mocked(getDoc).mockResolvedValue({
				exists: () => false,
			} as any);

			await expect(
				AuditService.getAuditResult('non-existent-id')
			).rejects.toThrow();
		});
	});

	// Add more tests for other AuditService methods as needed
});
