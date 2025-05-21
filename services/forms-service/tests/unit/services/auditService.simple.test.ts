import { describe, it, expect, beforeEach } from 'vitest';
import { AuditService } from '../../../src/services/auditService';
import { NistAudit } from '../../../src/schemas/formSchema';

describe('AuditService', () => {
	beforeEach(() => {
		// No need to reset mocks anymore
	});

	describe('prepareAuditResultObject', () => {
		it('should calculate completion percentage correctly', () => {
			// Create a mock audit with responses
			const mockAudit = {
				id: 'test-id',
				program: 'Test Program',
				companyId: 'test-company-id',
				auditDate: '2023-05-21',
				sections: [
					{
						id: 'section1',
						section: 'section1',
						title: 'Test Section',
						subsections: [
							{
								id: 'subsection1',
								subsection: 'subsection1',
								title: 'Test Subsection',
								questions: [
									{
										id: 'q1',
										text: 'Question 1',
										options: [],
										response: 'yes' as const,
										observations: '',
										evidence_url: '',
									},
									{
										id: 'q2',
										text: 'Question 2',
										options: [],
										response: 'partial' as const,
										observations: '',
										evidence_url: '',
									},
								],
							},
						],
					},
				],
			};

			const result = AuditService.prepareAuditResultObject(
				mockAudit as unknown as NistAudit
			);

			// Basic validation
			expect(result).toBeDefined();
			// Since we're not mocking UUID now, we just check that the ID exists
			expect(result.id).toBeTruthy();
			expect(result.program).toBe('Test Program');
			// Check that the sections object contains our section
			expect(result.sections).toHaveProperty('section1');
			expect(result.sections.section1.title).toBe('Test Section');
			// Check the completion percentage calculation (yes=100%, partial=50%, no=0%)
			// With one 'yes' (100%) and one 'partial' (50%), average should be 75%
			expect(result.sections.section1.completionPercentage).toBe(75);
		});
	});

	// Add more tests as needed
});
