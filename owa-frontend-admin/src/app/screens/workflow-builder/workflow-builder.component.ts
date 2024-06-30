import { Component, AfterViewInit, Input } from '@angular/core';
import Drawflow from 'drawflow';

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.scss'],
})
export class WorkflowBuilderComponent implements AfterViewInit {
  @Input()
  nodes: any[];
  @Input()
  drawingData: string;
  @Input()
  locked: boolean;
  @Input()
  showLock: boolean;
  @Input()
  showNodes: boolean;
  @Input()
  otherDetails: any;

  editor!: any;
  editDivHtml: HTMLElement;
  editButtonShown: boolean = false;

  drawnNodes: any[] = [];
  selectedNodeId: string;
  selectedNode: any = {};

  lastMousePositionEv: any;

  mobile_item_selec: string;
  mobile_last_move: TouchEvent | null;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initDrawingBoard();
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
          Other: {
            data: {
              '8': {
                id: 8,
                name: 'personalized',
                data: {},
                class: 'personalized',
                html: '\n            <div>\n              Personalized\n            </div>\n            ',
                typenode: false,
                inputs: {
                  input_1: {
                    connections: [
                      { node: '12', input: 'output_1' },
                      { node: '12', input: 'output_2' },
                      { node: '12', input: 'output_3' },
                      { node: '12', input: 'output_4' },
                    ],
                  },
                },
                outputs: {
                  output_1: { connections: [{ node: '9', output: 'input_1' }] },
                },
                pos_x: 764,
                pos_y: 227,
              },
              '9': {
                id: 9,
                name: 'dbclick',
                data: { name: 'Hello World!!' },
                class: 'dbclick',
                html: '\n            <div>\n            <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>\n              <div class="box dbclickbox" ondblclick="showpopup(event)">\n                Db Click here\n                <div class="modal" style="display:none">\n                  <div class="modal-content">\n                    <span class="close" onclick="closemodal(event)">&times;</span>\n                    Change your variable {name} !\n                    <input type="text" df-name>\n                  </div>\n\n                </div>\n              </div>\n            </div>\n            ',
                typenode: false,
                inputs: {
                  input_1: { connections: [{ node: '8', input: 'output_1' }] },
                },
                outputs: {
                  output_1: {
                    connections: [{ node: '12', output: 'input_2' }],
                  },
                },
                pos_x: 209,
                pos_y: 38,
              },
              '12': {
                id: 12,
                name: 'multiple',
                data: {},
                class: 'multiple',
                html: '\n            <div>\n              <div class="box">\n                Multiple!\n              </div>\n            </div>\n            ',
                typenode: false,
                inputs: {
                  input_1: { connections: [] },
                  input_2: { connections: [{ node: '9', input: 'output_1' }] },
                  input_3: { connections: [] },
                },
                outputs: {
                  output_1: { connections: [{ node: '8', output: 'input_1' }] },
                  output_2: { connections: [{ node: '8', output: 'input_1' }] },
                  output_3: { connections: [{ node: '8', output: 'input_1' }] },
                  output_4: { connections: [{ node: '8', output: 'input_1' }] },
                },
                pos_x: 179,
                pos_y: 272,
              },
            },
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
      console.log(
        'Editor Event :>> Position mouse x:' + position.x + ' y:' + position.y
      );
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
    console.log(ev);
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
      case 'facebook':
        var facebook = `
      <div>
        <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
      </div>
      `;
        this.editor.addNode(
          'facebook',
          0,
          1,
          pos_x,
          pos_y,
          'facebook',
          {},
          facebook
        );
        break;
      case 'slack':
        var slackchat = `
        <div>
          <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
        </div>
        `;
        this.editor.addNode(
          'slack',
          1,
          0,
          pos_x,
          pos_y,
          'slack',
          {},
          slackchat
        );
        break;
      case 'github':
        var githubtemplate = `
        <div>
          <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
          <div class="box">
            <p>Enter repository url</p>
          <input type="text" df-name>
          </div>
        </div>
        `;
        this.editor.addNode(
          'github',
          0,
          1,
          pos_x,
          pos_y,
          'github',
          { name: '' },
          githubtemplate
        );
        break;
      case 'telegram':
        var telegrambot = `
        <div>
          <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
          <div class="box">
            <p>Send to telegram</p>
            <p>select channel</p>
            <select df-channel>
              <option value="channel_1">Channel 1</option>
              <option value="channel_2">Channel 2</option>
              <option value="channel_3">Channel 3</option>
              <option value="channel_4">Channel 4</option>
            </select>
          </div>
        </div>
        `;
        this.editor.addNode(
          'telegram',
          1,
          0,
          pos_x,
          pos_y,
          'telegram',
          { channel: 'channel_3' },
          telegrambot
        );
        break;
      case 'aws':
        var aws = `
        <div>
          <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
          <div class="box">
            <p>Save in aws</p>
            <input type="text" df-db-dbname placeholder="DB name"><br><br>
            <input type="text" df-db-key placeholder="DB key">
            <p>Output Log</p>
          </div>
        </div>
        `;
        this.editor.addNode(
          'aws',
          1,
          1,
          pos_x,
          pos_y,
          'aws',
          { db: { dbname: '', key: '' } },
          aws
        );
        break;
      case 'log':
        var log = `
          <div>
            <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
          </div>
          `;
        this.editor.addNode('log', 1, 0, pos_x, pos_y, 'log', {}, log);
        break;
      case 'google':
        var google = `
          <div>
            <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
          </div>
          `;
        this.editor.addNode('google', 1, 0, pos_x, pos_y, 'google', {}, google);
        break;
      case 'email':
        var email = `
          <div>
            <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
          </div>
          `;
        this.editor.addNode('email', 1, 0, pos_x, pos_y, 'email', {}, email);
        break;

      case 'template':
        var template = `
          <div>
            <div class="title-box"><i class="fas fa-code"></i> Template</div>
            <div class="box">
              Ger Vars
              <textarea df-template></textarea>
              Output template with vars
            </div>
          </div>
          `;
        this.editor.addNode(
          'template',
          1,
          1,
          pos_x,
          pos_y,
          'template',
          { template: 'Write your template' },
          template
        );
        break;
      case 'multiple':
        var multiple = `
          <div>
            <div class="box">
              Multiple!
            </div>
          </div>
          `;
        this.editor.addNode(
          'multiple',
          3,
          4,
          pos_x,
          pos_y,
          'multiple',
          {},
          multiple
        );
        break;
      case 'personalized':
        var personalized = `
          <div>
            Personalized
          </div>
          `;
        this.editor.addNode(
          'personalized',
          1,
          1,
          pos_x,
          pos_y,
          'personalized',
          {},
          personalized
        );
        break;
      case 'dbclick':
        var dbclick = `
          <div>
          <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
            <div class="box dbclickbox" ondblclick="showpopup(event)">
              Db Click here
              <div class="modal" style="display:none">
                <div class="modal-content">
                  <span class="close" onclick="closemodal(event)">&times;</span>
                  Change your variable {name} !
                  <input type="text" df-name>
                </div>

              </div>
            </div>
          </div>
          `;
        this.editor.addNode(
          'dbclick',
          1,
          1,
          pos_x,
          pos_y,
          'dbclick',
          { name: '' },
          dbclick
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
}
