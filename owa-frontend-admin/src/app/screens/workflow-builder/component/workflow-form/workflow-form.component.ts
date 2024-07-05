import { Component, AfterViewInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Drawflow from 'drawflow';
import { WorkflowPropertiesModalComponent } from '../modals/workflow-properties-modal/workflow-properties-modal.component';
import { WorkflowBuilderService } from '../../services/workflow-builder.service';

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss'],
})
export class WorkflowFormComponent implements AfterViewInit {
  preTasksArray: any = [];

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

  constructor(
    private dialog: MatDialog,
    private workflowService: WorkflowBuilderService
  ) {}

  ngOnInit() {
    this.getNodeList();
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

      const dataToImport = {
        drawflow: {
          Home: {
            data: {},
          },
          Other: {
            data: {},
          },
        },
      };
      this.editor.import(dataToImport);
    }
  }

  private addEditorEvents() {
    this.editor.on('nodeCreated', (id: any) => {
      console.log(
        'Editor Event :>> Node created ' + id,
        this.editor.getNodeFromId(id)
      );
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
      console.log(
        'Editor Event :>> Node selected :>> this.selectedNode :>> ',
        this.selectedNode
      );
      console.log(
        'Editor Event :>> Node selected :>> this.selectedNode :>> ',
        this.selectedNode.data
      );
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
    console.log(ev);

    this.mobile_last_move = ev;
  }

  public allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    if (ev.type === 'touchstart') {
      this.selectedNode = ev.target
        .closest('.drag-drawflow')
        .getAttribute('data-node');
    } else {
      ev.dataTransfer.setData('node', ev.target.getAttribute('data-node'));
    }
  }

  drop(ev: any) {
    this.editor.on('nodeCreated', (id: any) => {
      const data = this.editor.getNodeFromId(id);
      if (!'startTask, endTask'.includes(data.name)) {
        this.openModal(data);
      }
    });
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

  private addNodeToDrawFlow(name: string, pos_x: number, pos_y: number) {
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

    switch (name) {
      case 'startTask':
        var startTask = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
            <i class="fa-play fa-solid text-xl text-red-600 me-2"></i> Start Task
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder="Start task">
            <span class="bg-green-200 text-black ps-3 pe-8 py-1 text-xs rounded-full">Connection task</span>
          </div>
        </div>
      `;
        this.editor.addNode(
          'startTask',
          0,
          1,
          pos_x,
          pos_y,
          'startTask',
          {},
          startTask
        );
        break;
      case 'endTask':
        var endTask = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
            <i class="fa-regular fa-circle-stop text-xl text-red-600 me-2"></i> End Task
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder="End task">
          </div>
        </div>
      `;
        this.editor.addNode(
          'endTask',
          1,
          0,
          pos_x,
          pos_y,
          'endTask',
          {},
          endTask
        );
        break;
      case 'addTask':
        var addTask = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
            <i class="fa-solid fa-plus text-xl text-red-600 me-2"></i> Add Task
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" disabled class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder="Add task">
            <span class="bg-green-200 text-black ps-3 pe-8 py-1 text-xs rounded-full">Connection task</span>
          </div>
        </div>
      `;
        this.editor.addNode(
          'addTask',
          1,
          1,
          pos_x,
          pos_y,
          'Add Task',
          {},
          addTask
        );
        break;
      case 'emailTask':
        var emailTask = `
        <div>
          <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
            <i class="fa-solid fa-envelope text-xl text-red-600 me-2"></i> Email Task
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" disabled class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder="Email task">
            <span class="bg-green-200 text-black ps-3 pe-8 py-1 text-xs rounded-full">Connection task</span>
          </div>
        </div>
      `;
        this.editor.addNode(
          'emailTask',
          1,
          1,
          pos_x,
          pos_y,
          'Email Task',
          {},
          emailTask
        );
        break;
      case 'smsTask':
        var smsTask = `
          <div>
            <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
              <i class="fa-solid fa-comment-sms text-xl text-red-600 me-2"></i> SMS Task
            </div>
            <div class="box p-2 flex flex-col items-end">
              <input type="text" disabled class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder="sms task">
              <span class="bg-green-200 text-black ps-3 pe-8 py-1 text-xs rounded-full">Connection task</span>
            </div>
          </div>
        `;
        this.editor.addNode(
          'smsTask',
          1,
          1,
          pos_x,
          pos_y,
          'SMS Task',
          {},
          smsTask
        );
        break;
      case 'whatsappTask':
        var whatsappTask = `
          <div>
            <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
              <i class="fa-brands fa-whatsapp text-xl text-red-600 me-2"></i> Whatsapp Task
            </div>
            <div class="box p-2 flex flex-col items-end">
              <input type="text" disabled class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder="Whatsapp task">
              <span class="bg-green-200 text-black ps-3 pe-8 py-1 text-xs rounded-full">Connection task</span>
            </div>
          </div>
        `;
        this.editor.addNode(
          'whatsappTask',
          1,
          1,
          pos_x,
          pos_y,
          'Whatsapp Task',
          {},
          whatsappTask
        );
        break;
      case 'decisionTask':
        var decisionTask = `
           <div>
          <div class="bg-gray-100 px-3 flex items-center text-sm py-2">
            <i class="fa-solid fa-arrows-split-up-and-left text-xl text-red-600 me-2"></i> Decision Task
          </div>
          <div class="box p-2 flex flex-col items-end">
            <input type="text" class="border rounded text-sm w-full py-2 ps-2 outline-none mb-2" placeholder="Decision task">
          </div>
        </div>
          `;
        this.editor.addNode(
          'decisionTask',
          1,
          2,
          pos_x,
          pos_y,
          'decisionTask',
          { decisionTask: 'Write your decisionTask' },
          decisionTask
        );
        break;
      default:
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

  openModal(data: any) {
    const dialog = this.dialog.open(WorkflowPropertiesModalComponent, {
      width: 'clamp(20rem, 60vw, 35rem)',
      panelClass: ['animate__animated', 'animate__slideInRight'],
      position: { right: '0px', top: '0px', bottom: '0px' },
      disableClose: true,
      data: { ...data },
    });
  }
}
