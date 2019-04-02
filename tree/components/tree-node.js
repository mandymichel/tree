import { LitElement, html } from "lit-element";
import style from "./tree-container.scss";

export class TreeNode extends LitElement {
  render() {
    return html`
      <style>
        ${style}
      </style>
      <div class="row">
        ${
          !this.node.expanded &&
          (this.node && this.node.children && this.node.children.length > 0)
            ? html`
                <a role="button" @click="${e => this.__expand(e)}"
                  ><div class="arrow">&#8594;</div></a
                >
              `
            : this.node && this.node.children && !this.node.children.length
            ? html``
            : html`
                <a role="button" @click="${e => this.__expand(e)}"
                  ><div class="arrow">&#8595;</div></a
                >
              `
        }
        <input
          type="checkbox"
          id="node-check"
          label="${
            this.node.data
              ? this.node.data.productName
                ? this.node.data.productName
                : this.node.data.productCategoryCode
              : "Merchandise Catalog"
          }"
          @click="${e => this.__select(e)}"
          .checked="${this.node.checked}"
        ></input>
        <label for="node-check">${
          this.node.data
            ? this.node.data.productName
              ? this.node.data.productName
              : this.node.data.productCategoryCode
            : "Merchandise Catalog"
        }</label>
        ${
          this.node.expanded && (this.node && this.node.children.length > 0)
            ? html`
                ${this.node.children
                  ? html`
                      <ul>
                        ${this.node.children.map(mynode => {
                          return html`
                            <li>
                              <tree-node
                                id="child-node"
                                .node=${mynode}
                                .checked=${mynode.checked}
                              ></tree-node>
                            </li>
                          `;
                        })}
                      </ul>
                    `
                  : html``}
              `
            : ``
        }
      </div>
    `;
  }

  static get properties() {
    return {
      node: Object,
      expanded: Boolean,
      checked: Boolean
    };
  }

  constructor() {
    super();
  }

  updateChildrenChecked(newCheckedState) {
    const children = Array.from(
      this.shadowRoot.querySelectorAll("#child-node")
    );

    children.map(newNode => {
      newNode.updateChildrenChecked(newCheckedState);
      newNode.checked = newCheckedState;
    });
  }

  firstUpdated() {
    super.firstUpdated();
  }

  expand(bool) {
    console.log("meme", "expand", bool, this.node);
    this.node.expand(bool);
    this.expanded = bool;
  }

  __expand(e) {
    const startTime = new Date().getTime();
    this.expand(!this.node.expanded);
    const endTime = new Date().getTime();
    const totalTime = endTime - startTime;
    console.log("total time expanding", totalTime);
  }

  __select(e) {
    console.log("meme", e);
    this.node.checked = !this.node.checked;
    const checkedState = this.node.checked;
    this.node.children.map(mynode => {
      mynode.checked = checkedState;
    });
  }
}

window.customElements.define("tree-node", TreeNode);

export default TreeNode;
