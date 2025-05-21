/**
 * Test helpers for forms-service tests
 * Contains factory functions to create test data consistently
 */

import { NistAudit, AuditResult, OptionValue } from '../../../src/schemas/formSchema';

/**
 * Creates a simple valid audit object for testing
 * @param overrides - Properties to override in the default audit object
 * @returns A valid NistAudit object for testing
 */
export function createTestAudit(overrides = {}): NistAudit {
  const defaultAudit: NistAudit = {
    id: 'test-audit-id',
    program: 'Test Program',
    companyId: 'test-company-id',
    auditDate: '2025-05-21',
    sections: [
      {
        id: 'section1',
        title: 'Section 1',
        subsections: [
          {
            id: 'subsection1',
            title: 'Subsection 1',
            questions: {
              'q1': {
                text: 'Question 1',
                response: 'yes',
                observations: 'Test observation',
                evidence_url: ''
              },
              'q2': {
                text: 'Question 2',
                response: 'partial',
                observations: 'Test observation 2',
                evidence_url: ''
              }
            }
          }
        ],
        questions: {}
      }
    ]
  };
  
  return { ...defaultAudit, ...overrides };
}

/**
 * Creates a simple valid audit result object for testing
 * @param overrides - Properties to override in the default audit result
 * @returns A valid AuditResult object for testing
 */
export function createTestAuditResult(overrides = {}): AuditResult {
  const defaultResult: AuditResult = {
    id: 'test-result-id',
    program: 'Test Program',
    companyId: 'test-company-id',
    auditDate: '2025-05-21',
    completionPercentage: 75,
    sections: [
      {
        id: 'section1',
        title: 'Section 1',
        subsections: [
          {
            id: 'subsection1',
            title: 'Subsection 1',
            questions: {
              'q1': {
                text: 'Question 1',
                response: 'yes',
                observations: 'Test observation',
                evidence_url: ''
              }
            }
          }
        ],
        questions: {}
      }
    ]
  };
  
  return { ...defaultResult, ...overrides };
}
