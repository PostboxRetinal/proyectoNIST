/**
 * Test helpers for forms-service tests
 * Contains factory functions to create test data consistently
 */

import { NistAudit, AuditResult } from '../../src/schemas/formSchema';

/**
 * Creates a simple valid audit object for testing
 * @param overrides - Properties to override in the default audit object
 * @returns A valid NistAudit object for testing
 */
export function createTestAudit(overrides = {}): NistAudit {
  const defaultAudit: NistAudit = {
    program: 'Test Program',
    sections: [
      {
        section: '1',
        title: 'PLANIFICAR (PLAN)',
        subsections: [
          {
            subsection: '1.1',
            title: 'Risk Framing',
            questions: [
              {
                id: 'q1',
                text: 'Question 1',
                options: [
                  {
                    value: 'yes',
                    label: 'Sí',
                    description: 'Descripción de sí'
                  },
                  {
                    value: 'no',
                    label: 'No',
                    description: 'Descripción de no'
                  }
                ],
                response: 'yes',
                observations: 'Test observation',
                evidence_url: ''
              },
              {
                id: 'q2',
                text: 'Question 2',
                options: [
                  {
                    value: 'yes',
                    label: 'Sí',
                    description: 'Descripción de sí'
                  },
                  {
                    value: 'partial',
                    label: 'Parcial',
                    description: 'Descripción de parcial'
                  }
                ],
                response: 'partial',
                observations: 'Test observation 2',
                evidence_url: ''
              }
            ]
          }
        ]
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
    auditDate: new Date(),
    completionPercentage: 75,
    sections: {
      '1': {
        title: 'PLANIFICAR (PLAN)',
        completionPercentage: 80,
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
    },
    sectionTitles: {
      '1': 'PLANIFICAR (PLAN)'
    },
    subsectionTitles: {
      '1.1': 'Risk Framing'
    }
  };
  
  return { ...defaultResult, ...overrides };
}
