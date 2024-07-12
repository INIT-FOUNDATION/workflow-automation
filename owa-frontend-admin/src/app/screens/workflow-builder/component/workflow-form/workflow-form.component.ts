import { Component, AfterViewInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Drawflow from 'drawflow';
import { WorkflowPropertiesModalComponent } from '../modals/workflow-properties-modal/workflow-properties-modal.component';
import { WorkflowBuilderService } from '../../services/workflow-builder.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/modules/shared/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

interface workflowObject {
  workflow: any;
  tasks: any[];
  transitions: any[];
}

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss'],
})
export class WorkflowFormComponent implements AfterViewInit {
  preTasksArray: any = [];
  chosenNodes: workflowObject = {
    workflow: {},
    tasks: [],
    transitions: [],
  };
  workflowForm: FormGroup;
  transitionForm: FormGroup;
  node_details: {
    name: any;
    node_id: number;
    node_type: any;
    is_new: boolean;
    task_id: number;
    form_id: number;
    x_axis: number;
    y_axis: number;
  };
  items: MenuItem[];
  @Input() formType: string;
  @Input() nodes: any[];
  @Input() drawingData: string;
  @Input() locked: boolean;
  @Input() showLock: boolean;
  @Input() showNodes: boolean;
  @Input() otherDetails: any;

  editor!: any;
  editDivHtml: HTMLElement;
  editButtonShown: boolean = false;

  drawnNodes: any[] = [];
  selectedNodeId: string;
  selectedNode: any = {};

  lastMousePositionEv: any;

  mobile_item_selec: string;
  mobile_last_move: TouchEvent | null;

  nodeName: any = [];
  workflow_id: any;

  constructor(
    private dialog: MatDialog,
    private workflowService: WorkflowBuilderService,
    private utilityService: UtilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.getNodeList();
    this.contextMenu();
    if (this.formType == 'edit') {
      this.workflow_id = this.activatedRoute.snapshot.params['id'].substring(1);
      this.getWorkflowById();
    }
  }

  contextMenu() {
    this.items = [
      {
        label: 'View',
        icon: 'pi pi-fw pi-search',
        // command: () => this.viewProduct(this.selectedProduct),
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-times',
        // command: () => this.deleteProduct(this.selectedProduct),
      },
    ];
  }

  initForm() {
    this.workflowForm = new FormGroup({
      workflow_name: new FormControl(null, [Validators.required]),
      workflow_description: new FormControl(null, [Validators.required]),
    });

    this.transitionForm = new FormGroup({
      from_task_id: new FormControl(null),
      to_task_id: new FormControl(null),
    });
  }

  ngAfterViewInit(): void {
    this.initDrawingBoard();
  }

  getNodeList() {
    try {
      this.workflowService.getTaskList().subscribe((res: any) => {
        this.preTasksArray = res.data.nodeList;
      });
    } catch (error) {
      console.log(error);
    }
  }

  private initDrawingBoard() {
    this.initDrawFlow();
    if (!this.locked) {
      this.addEditorEvents();
      this.dragEvent();
    }
  }

  private initDrawFlow(): void {
    if (typeof document !== 'undefined') {
      const drawFlowHtmlElement = document.getElementById('drawflow');
      this.editor = new Drawflow(drawFlowHtmlElement as HTMLElement);

      this.editor.reroute = true;
      this.editor.curvature = 0.5;
      this.editor.reroute_fix_curvature = true;
      this.editor.reroute_curvature = 0.5;
      this.editor.force_first_input = false;
      this.editor.line_path = 1;
      this.editor.editor_mode = 'edit';

      this.editor.start();

      let dataToImport = {
        drawflow: {
          Home: {
            data: {},
          },
          Other: {
            data: {},
          },
        },
      };

      this.chosenNodes.tasks.forEach((task) => {
        this.chosenNodes.transitions.forEach((transition) => {
          console.log(task);          
          console.log(transition);

          const taskHtml = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center justify-between text-sm py-2">
            <span><i class="${task.node_icon} text-xl text-red-600 me-2"></i>${task.task_name}</span>
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" disabled placeholder="${task.task_name}" />
            <span class="bg-green-200 text-black ps-3 pe-8 py-1 text-xs rounded-full">Connection task</span>
          </div>
        </div>
        `;

          const decisionHtml = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
            <i class="${task.task_icon} text-xl text-red-600 me-2"></i>  ${task.decision_task_name}
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder=" ${task.decision_task_name}">
          </div>
        </div>
          `;

          const nodeData = {
            id: task.task_id ? task.task_id : task.decision_task_id,
            name: task.task_name ? task.task_name : task.decision_task_name,
            data: {},
            class: task.task_name ? task.task_name : task.decision_task_name,
            html: task.task_id ? taskHtml : decisionHtml,
            typenode: false,
            inputs: {
              input_1: {
                connections: [
                  { node: transition.from_task_id, input: 'output_1' },
                ],
              },
            },
            outputs: {
              output_1: {
                connections: { node: transition.to_task_id, output: 'input_1' },
              },
            },
            pos_x: parseInt(task.x_axis),
            pos_y: parseInt(task.y_axis),
          };

          if (!dataToImport.drawflow.Home.data) {
            dataToImport.drawflow.Home.data = {};
          }

          dataToImport.drawflow.Home.data[task.node_id] = nodeData;
        });
      });

      this.editor.import(dataToImport);
    }
  }

  private addEditorEvents() {
    this.editor.on('nodeCreated', (id: any) => {
      console.log(
        'Editor Event :>> Node created ' + id,
        this.editor.getNodeFromId(id)
      );
      const data = this.editor.getNodeFromId(id);
      this.nodeName.push(data.name);

      if (!'Start Task, End Task'.includes(data.name)) {
        this.openModal(id, data);
      } else {
        if (
          data.name.includes('Start Task') ||
          data.name.includes('End Task')
        ) {
          let obj: any = {
            name: data.name,
            node_id: data.name == 'Start Task' ? 1 : 2,
            node_type: 'T',
            is_new: true,
            task_id: id,
            task_name: data.name,
            task_description: data.name,
            x_axis: data.pos_x.toString(),
            y_axis: data.pos_y.toString(),
            form_id: 11,
          };
          this.chosenNodes.tasks.push(obj);
        }
      }
    });

    this.editor.on('nodeRemoved', (id: any) => {
      console.log('Editor Event :>> Node removed ' + id);
    });

    this.editor.on('nodeSelected', (id: any) => {
      console.log(
        'Editor Event :>> Node selected ' + id,
        this.editor.getNodeFromId(id)
      );
      this.selectedNode = this.editor.drawflow.drawflow.Home.data[`${id}`];
    });

    this.editor.on('click', (e: any) => {
      console.log('Editor Event :>> Click :>> ', e);

      if (
        e.target.closest('.drawflow_content_node') != null ||
        e.target.classList[0] === 'drawflow-node'
      ) {
        if (e.target.closest('.drawflow_content_node') != null) {
          this.selectedNodeId = e.target.closest(
            '.drawflow_content_node'
          ).parentElement.id;
        } else {
          this.selectedNodeId = e.target.id;
        }
        this.selectedNode =
          this.editor.drawflow.drawflow.Home.data[
            `${this.selectedNodeId.slice(5)}`
          ];
      }

      if (
        e.target.closest('#editNode') != null ||
        e.target.classList[0] === 'edit-node-button'
      ) {
      }

      if (e.target.closest('#editNode') === null) {
        this.hideEditButton();
      }
    });

    this.editor.on('moduleCreated', (name: any) => {
      console.log('Editor Event :>> Module Created ' + name);
    });

    this.editor.on('moduleChanged', (name: any) => {
      console.log('Editor Event :>> Module Changed ' + name);
    });

    this.editor.on('connectionCreated', (connection: any) => {
      console.log('Editor Event :>> Connection created ', connection);
      this.transitionForm
        .get('from_task_id')
        .setValue(parseInt(connection.input_id));
      this.transitionForm
        .get('to_task_id')
        .setValue(parseInt(connection.output_id));
      this.chosenNodes.transitions.push(this.transitionForm.getRawValue());
    });

    this.editor.on('connectionRemoved', (connection: any) => {
      console.log('Editor Event :>> Connection removed ', connection);
    });

    this.editor.on('zoom', (zoom: any) => {
      console.log('Editor Event :>> Zoom level ' + zoom);
    });

    this.editor.on('addReroute', (id: any) => {
      console.log('Editor Event :>> Reroute added ' + id);
    });

    this.editor.on('removeReroute', (id: any) => {
      console.log('Editor Event :>> Reroute removed ' + id);
    });

    this.editor.on('mouseMove', (position: any) => {
      // console.log(
      //   'Editor Event :>> Position mouse x:' + position.x + ' y:' + position.y
      // );
    });

    this.editor.on('nodeMoved', (id: any) => {
      console.log('Editor Event :>> Node moved ' + id);
    });

    this.editor.on('translate', (position: any) => {
      console.log(
        'Editor Event :>> Translate x:' + position.x + ' y:' + position.y
      );
    });
  }

  private dragEvent() {
    var elements = Array.from(document.getElementsByClassName('drag-drawflow'));

    elements.forEach((element) => {
      element.addEventListener('touchend', this.drop.bind(this), false);
      element.addEventListener(
        'touchmove',
        this.positionMobile.bind(this),
        false
      );
      element.addEventListener('touchstart', this.drag.bind(this), false);
      element.addEventListener('dblclick', (event) => {});
    });
  }

  private positionMobile(ev: any) {
    this.mobile_last_move = ev;
  }

  public allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any, data) {
    if (ev.type === 'touchstart') {
      this.selectedNode = ev.target
        .closest('.drag-drawflow')
        .getAttribute('data-node');
    } else {
      ev.dataTransfer.setData('node', JSON.stringify(data));
    }
  }

  drop(ev: any) {
    if (ev.type === 'touchend' && this.mobile_last_move) {
      var parentdrawflow = document
        .elementFromPoint(
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        )
        ?.closest('#drawflow');
      if (parentdrawflow != null) {
        this.addNodeToDrawFlow(
          this.mobile_item_selec,
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        );
      }
      this.mobile_item_selec = '';
    } else {
      ev.preventDefault();
      var data = ev.dataTransfer.getData('node');
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  private addNodeToDrawFlow(name: any, pos_x: number, pos_y: number) {
    let data = JSON.parse(name);
    let form_id: number;
    this.chosenNodes.tasks.forEach((res: any) => {
      if (res.form_id) {
        form_id = res.form_id;
      }
    });

    this.node_details = {
      name: data.node_name,
      node_id: data?.node_id,
      node_type: data?.node_type,
      is_new: true,
      task_id: null,
      form_id: form_id,
      x_axis: null,
      y_axis: null,
    };

    if (this.editor.editor_mode === 'fixed') {
      return false;
    }

    pos_x =
      pos_x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().x *
        (this.editor.precanvas.clientWidth /
          (this.editor.precanvas.clientWidth * this.editor.zoom));
    pos_y =
      pos_y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom)) -
      this.editor.precanvas.getBoundingClientRect().y *
        (this.editor.precanvas.clientHeight /
          (this.editor.precanvas.clientHeight * this.editor.zoom));

    const task_name = this.chosenNodes.tasks.forEach((res: any) => {
      if (res.node_id == data.node_id) {
        return res.node_name ? res.node_name : '';
      }
    });

    if (data.node_name !== 'Decision Task') {
      var nodeTemplate = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center justify-between text-sm py-2">
            <span><i class="${data.node_icon} text-xl text-red-600 me-2"></i>${data.node_name}</span>
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" disabled placeholder="${data.node_name}" />
            <span class="bg-green-200 text-black ps-3 pe-8 py-1 text-xs rounded-full">Connection task</span>
          </div>
        </div>
            `;
      this.editor.addNode(
        data.node_name,
        data.no_of_input_nodes,
        data.no_of_output_nodes,
        pos_x,
        pos_y,
        data.node_name,
        {},
        nodeTemplate
      );

      // const modalOpener = document.getElementById(`${data.node_name}`);
      // if (modalOpener) {
      //   modalOpener.addEventListener('click', () => this.openModal());
      // }
    } else {
      var decisionTemplate = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
            <i class="${data.node_icon} text-xl text-red-600 me-2"></i>  ${data.node_name}
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder=" ${data.node_name}">
          </div>
        </div>
          `;
      this.editor.addNode(
        data.node_name,
        data.no_of_input_nodes,
        data.no_of_output_nodes,
        pos_x,
        pos_y,
        data.node_name,
        {},
        decisionTemplate
      );
    }

    return true;
  }

  exportDrawingData() {
    return this.editor.export();
  }

  private hideEditButton() {
    this.editButtonShown = false;
    this.editDivHtml = document.getElementById('editNode')!;
    if (this.editDivHtml) {
      this.editDivHtml.remove();
    }
  }

  onClear() {
    this.editor.clear();
  }

  export() {
    return this.editor.export();
  }

  onZoomOut() {
    this.editor.zoom_out();
  }

  onZoomIn() {
    this.editor.zoom_in();
  }

  onZoomReset() {
    this.editor.zoom_reset();
  }

  getWorkflowById() {
    this.workflowService
      .getWorkflowById(this.workflow_id)
      .subscribe((res: any) => {
        this.chosenNodes = res.data;
        this.initDrawFlow();

        this.workflowForm.patchValue({
          workflow_name: this.chosenNodes.workflow.workflow_name,
          workflow_description: this.chosenNodes.workflow.workflow_description,
        });
      });
  }

  openModal(id: number, data: any) {
    this.node_details.task_id = id;
    this.node_details.x_axis = data.pos_x;
    this.node_details.y_axis = data.pos_y;

    const dialog = this.dialog.open(WorkflowPropertiesModalComponent, {
      width: 'clamp(20rem, 60vw, 35rem)',
      panelClass: ['animate__animated', 'animate__slideInRight'],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: true,
      data: { node_details: this.node_details, data: this.chosenNodes },
    });
  }

  submitForm() {
    this.chosenNodes.workflow = this.workflowForm.getRawValue();
    console.log(this.chosenNodes);
    try {
      if (
        this.nodeName.includes('Start Task') &&
        this.nodeName.includes('End Task')
      ) {
        if (this.workflowForm.valid) {
          this.workflowService
            .createWorkflow(this.chosenNodes)
            .subscribe((res: any) => {
              this.utilityService.showSuccessMessage(
                'Workflow created successfully!'
              );
              this.router.navigate(['workflow-builder']);
            });
        }
      } else {
        this.utilityService.showErrorMessage(
          'Please add Start Task and End Task'
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
