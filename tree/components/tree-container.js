import { LitElement, html } from "lit-element";
import style from "./tree-container.scss";
import "./tree-node.js";
import { data } from "./tree-data.js";

export default class TreeContainer extends LitElement {
  render() {
    return html`
      <style>
        ${style}
      </style>
      <div>
        ${this.root && this.root.children && this.root.children.length
          ? this.__renderTrees()
          : html``}
      </div>
    `;
  }

  static get properties() {
    return {
      selectedTabIndex: Number,
      dataList: Array,
      __displayedProductTypes: Array,
      __loadingTree: Boolean,
      root: Object
    };
  }

  constructor() {
    super();
    this.selectedTabIndex = 0;
    this.dataList = [];
    this.__displayedProductTypes = [];
    this.__loadingTree = false;

    // Node class's properties
    this.root = {};
  }

  __renderTrees() {
    return this.root && this.root.children && this.root.children.length
      ? html`
          <div>
            <tree-node .node="${this.root}"></tree-node>
          </div>
        `
      : ``;
  }

  firstUpdated() {
    const startDate = new Date().getTime();
    console.log("start: ", new Date());
    if (this.dataList) {
      const root = new Node();
      root.productName = "Tree";
      const holder = {};
      for (let i = 0; i < this.dataList.length; i++) {
        const data = this.dataList[i];
        const node = new Node(data);
        if (node.parentNodeId == null) {
          root.children.push(node);
        }
        // incrementing the holder here
        holder[node.nodeId] = node;
      }

      for (let i = 0; i < this.dataList.length; i++) {
        const data = this.dataList[i];
        if (data.parentNodeId != null) {
          const parent = holder[data.parentNodeId];
          const child = holder[data.nodeId];
          parent.children.push(child);
        }
      }

      // just for looking at and verifying object creation
      this.root = root;
    }
    const endDate = new Date().getTime();
    console.log("Total time parsing: ", endDate - startDate);
  }
}

class Node {
  constructor(data) {
    this.children = [];
    this.data = data;
    this.expanded = false;
    this.checked = false;
    if (data != null) {
      this.parentNodeId = data.parentNodeId;
      this.productId = data.productId;
      this.nodeId = data.nodeId;
    }
  }

  expand(bool) {
    this.expanded = bool;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.expand(bool);
    }
  }

  maxDepth() {
    if (this.children.length == 0) {
      return 1;
    }
    let maxDepth = 1;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      const childDepth = child.maxDepth() + 1;
      if (childDepth > maxDepth) {
        maxDepth = childDepth;
      }
    }
    return maxDepth;
  }
}
window.customElements.define("tree-container", TreeContainer);
