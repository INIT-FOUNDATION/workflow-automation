import { TestBed } from '@angular/core/testing';

import { WorkflowBuilderService } from './workflow-builder.service';

describe('WorkflowBuilderService', () => {
  let service: WorkflowBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
