import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
declare var require: any;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private appVersionNo: string = require('../../../../../package.json').version;

  categories: any = ['Beginner', 'Basic', 'Intermediate', 'Expert'];
  getCourseList: any = [
    {
      id: 1,
      category: 'Beginner',
      courseName: 'Python',
      tag: 'Beginner',
      image: 'assets/images/coursesDialog/pythonCourse.svg',
      desc: 'Python is an efficient high-level data structures and a simple but effective approach to object-oriented programming.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'python',
      h1: 'Python course provides skills applicable across various domains like web development, data science, and automation.',
      h2: "Python's readability and simplicity make it accessible for beginners and efficient for experienced developers.",
      h3: 'Python offers a rich library of tools and frameworks for rapid development and diverse project solutions.',
      h4: 'Its widespread use ensures ample career opportunities and advancements across industries.',
      color: '#2775b5',
    },
    {
      id: 2,
      category: 'Beginner',
      courseName: 'Angular',
      tag: 'Beginner',
      image: 'assets/images/coursesDialog/angularCourse.svg',
      desc: 'Angular is an application-design framework and development platform for creating efficient and sophisticated single-page apps.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'angular',
      h1: 'Angular course empowers creation of feature-rich single-page applications, enhancing user experience and functionality.',
      h2: ' Angular enforces organization and scalability in development, improving code quality and maintenance.',
      h3: 'With Angular, access powerful features like data binding and routing, streamlining development process and etc.',
      h4: 'Angular learning fosters vibrant community support for developers.',
      color: '#b52e31',
    },
    {
      id: 3,
      category: 'Beginner',
      courseName: 'ReactJS',
      tag: 'Beginner',
      image: 'assets/images/coursesDialog/reactCourse.png',
      desc: 'React is a popular JavaScript library for building user interfaces. It is also referred to as a front-end JavaScript library.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'reactJs',
      h1: 'ReactJS course enables building interactive web interfaces for enhanced user experience.',
      h2: "React's component-based approach fosters code reusability and scalability, optimizing development workflow.",
      h3: "React's virtual DOM ensures fast rendering updates, enhancing performance and user interaction.",
      h4: 'Learning React provides access to a vast developer community, offering resources and support for continual learning.',
      color: '#53c1de',
    },
    {
      id: 4,
      category: 'Basic',
      courseName: 'NodeJS',
      tag: 'Basic',
      image: 'assets/images/coursesDialog/nodeJsCourse.jpg',
      desc: 'As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'nodeJs',
      h1: 'This course teaches the core of Node.js, empowering you to build scalable web applications efficiently.',
      h2: 'With Node.js, JavaScript spans both client and server, streamlining development and encouraging code reuse.',
      h3: 'Node.js excels in handling asynchronous tasks, ideal for crafting real-time applications like chats and gaming platforms.',
      h4: 'Express.js and Node.js boost API development, enhancing productivity.',
      color: '#72ba54',
    },
    {
      id: 5,
      category: 'Basic',
      courseName: 'Javascript',
      tag: 'Basic',
      image: 'assets/images/coursesDialog/jsCourse.png',
      desc: 'JavaScript is a scripting or programming language that allows you to implement complex features on web pages.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'javascript',
      h1: 'JavaScript is essential for creating dynamic and interactive web pages.',
      h2: "It's widely used across front-end, back-end, and full-stack development, making it indispensable in modern web development.",
      h3: 'JavaScript enables features like form validation and real-time updates, improving user engagement.',
      h4: 'Proficiency in JavaScript opens doors to learning advanced frameworks like React and Angular, crucial for building scalable web applications.',
      color: '#d5bf14',
    },
    {
      id: 6,
      category: 'Basic',
      courseName: 'HTML, CSS & Javascript',
      tag: 'Basic',
      image: 'assets/images/coursesDialog/htmlCssJsCourse.svg',
      desc: 'As an asynchronous event-driven JavaScript runtime, Node.js is designed to build scalable network applications.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'htmlCssJs',
      h1: 'Mastering HTML, CSS, and JavaScript is crucial for building websites from scratch.',
      h2: 'These skills are in high demand across industries, offering numerous career opportunities.',
      h3: 'Proficiency in these languages enables developers to create intuitive and attractive user interfaces.',
      h4: 'Learning HTML, CSS, and JavaScript sets the scategorye for ongoing adaptation to new web technologies.',
      color: '#f16529',
    },
    {
      id: 7,
      category: 'Intermediate',
      courseName: 'MEAN Stack',
      tag: 'Intermediate',
      image: 'assets/images/coursesDialog/meanStackCourse.png',
      desc: 'The MEAN stack is a modern web development framework comprising MongoDB, Express.js, AngularJS, and Node.js.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'meanStack',
      h1: 'MEAN stack uses JavaScript from server to client, streamlining communication and reducing overhead.',
      h2: "MEAN stack's Node.js and MongoDB's non-blocking architecture easily manage high user loads, perfect for scalability.",
      h3: "MEAN stack's lightweight, modular nature enables rapid prototyping, turning ideas into functional prototypes swiftly.",
      h4: 'MEAN stack benefits from open-source support, offering abundant resources for rapid development.',
      color: '#9029f1',
    },
    {
      id: 8,
      category: 'Intermediate',
      courseName: 'MERN Stack',
      tag: 'Intermediate',
      image: 'assets/images/coursesDialog/mernStackCourse.png',
      desc: 'The MERN stack is a modern web development framework comprising MongoDB, Express.js, React and Node.js.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'mernStack',
      h1: 'MERN stack comprises MongoDB, Express.js, React, and Node.js.',
      h2: 'Utilizes JavaScript throughout, simplifying development and enhancing consistency.',
      h3: 'Offers modular components for scalability and flexibility in building applications.',
      h4: 'Benefits from a vast ecosystem and strong community support for rapid development and problem-solving.',
      color: '#3f29f1',
    },
    {
      id: 9,
      category: 'Intermediate',
      courseName: 'ML & NLP',
      tag: 'Intermediate',
      image: 'assets/images/coursesDialog/nlpCourse.png',
      desc: 'ML and NLP offer automation, smarter decisions, personalized experiences, and language breakthroughs, driving innovation across industries.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'mlNlp',
      h1: 'The demand for ML and NLP professionals is rapidly growing across various industries such as technology, healthcare, finance, and e-commerce',
      h2: 'Skills in ML and NLP are highly valued, often leading to lucrative job o9ers and career growth.',
      h3: 'Understanding ML and NLP enables you to contribute to innovative projects, including AI-driven applications and research.',
      h4: 'The fields of ML and NLP are dynamic and constantly evolving, providing continuous learning opportunities.',
      color: '#32757d',
    },
    {
      id: 10,
      category: 'Expert',
      courseName: 'Artificial Intelligence',
      tag: 'Expert',
      image: 'assets/images/coursesDialog/aiCourse.png',
      desc: 'Artificial Intelligence (AI) o1ers numerous advancategoryes across various domains, enhancing e1iciency, productivity, and innovation.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'artificialIntelligence',
      h1: 'AI automates tasks, freeing humans for creativity, yet sparking concerns about job displacement.',
      h2: 'AI optimizes manufacturing, logistics, and supply chains, reducing costs and improving efficiency across industries through streamlined processes and data-driven decision-making.',
      h3: 'AI analyzes data, revealing patterns beyond human capability, enhancing decision-making across domains.',
      h4: 'AI predicts trends from data, aiding informed decisions and strategy development for businesses.',
      color: '#c255a8',
    },
    {
      id: 11,
      category: 'Expert',
      courseName: 'Devops',
      tag: 'Expert',
      image: 'assets/images/coursesDialog/devOpsCourse.png',
      desc: 'DevOps blends development and operations for faster delivery and superior software quality.',
      amount: 1999,
      days: 45,
      sessions: 20,
      img: 'devOps',
      h1: 'DevOps automates SDLC, covering deployment, provisioning, testing, and monitoring.',
      h2: 'DevOps fosters collaboration among development, operations, and stakeholders for smoother software delivery.',
      h3: 'DevOps focuses on real-time monitoring, feedback collection, and data-driven decision-making for continuous improvement.',
      h4: 'Security is integrated throughout the DevOps lifecycle, from code development to deployment and beyond.',
      color: '#1970a3',
    },
  ];

  constructor(private http: HttpClient) {}

  getEducationDegrees() {
    return this.http.get('/assets/json/education_degress.json');
  }

  getJobRoles() {
    return this.http.get('/assets/json/job_roles.json');
  }

  getCompanies() {
    return this.http.get('/assets/json/companies.json');
  }

  loadMindMapData(course: string) {
    return this.http.get(`/assets/json/course-mindmap-data/${course}.json`);
  }

  getPublicIp() {
    return this.http.get('https://api.ipify.org/?format=json');
  }

  enquiry(payload) {
    return this.http.post(`${environment.crm_prefix_url}/enquiry`, payload);
  }

  get appVersion() {
    return this.appVersionNo;
  }

  set appVersion(val) {
    this.appVersionNo = val;
  }

  getCourseDetails() {
    return this.getCourseList;
  }

  getCourseCategoryDetails() {
    return this.categories;
  }
}
