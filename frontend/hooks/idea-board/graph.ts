export class Node {
  public id = 0;
  public x = 0;
  public y = 0;
  public width = 180;
  public height = 60;
  public padding = 10;
  public horizontalGap = 50;
  public verticalGap = 30;
  public color = "#0f62fe";
  public textColor = "#FFFFFF";
  public fontSize = 16;
  public borderRadius = 2;

  constructor(
    public text: string,
    public parent: Node | null,
    public children: Node[] = []
  ) {}

  addChild(node: Node) {
    node.parent = this;
    this.children.push(node);
  }

  createAndAddChild(text: string) {
    const child = new Node(text, this);
    this.addChild(child);
    return child;
  }

  removeChild(node: Node) {
    const index = this.children.indexOf(node);
    if (index !== -1) {
      this.children.splice(index, 1);
      node.parent = null;
    }
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  getRoot() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let root: Node = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw the node background (rounded rectangle)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, this.borderRadius);
    ctx.fill();

    // Draw the text
    ctx.fillStyle = this.textColor;
    ctx.font = `${this.fontSize}px IBM Plex Sans`;
    ctx.textAlign = "center";
    ctx.textBaseline = "hanging";

    // Handle text wrapping for longer strings
    const maxWidth = this.width - 2 * this.padding;
    const words = this.text.split(" ");
    let line = "";
    let y = this.y + this.height / 2 - this.fontSize / 2;

    for (const word of words) {
      const testLine = line + (line ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && line !== "") {
        ctx.fillText(line, this.x + this.width / 2, y);
        line = word;
        y += this.fontSize + 2;
      } else {
        line = testLine;
      }
    }

    ctx.fillText(line, this.x + this.width / 2, y);
  }

  drawConnections(ctx: CanvasRenderingContext2D) {
    for (const child of this.children) {
      // Draw connection line from parent to child
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Start from the bottom center of this node
      const startX = this.x + this.width / 2;
      const startY = this.y + this.height;

      // End at the top center of the child node
      const endX = child.x + child.width / 2;
      const endY = child.y;

      // Create a curved path between nodes
      const controlPointY = (startY + endY) / 2;

      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(startX, controlPointY, endX, controlPointY, endX, endY);

      ctx.stroke();
    }
  }

  calculateLayout() {
    this.positionNodes();
    this.centerChildren();
  }

  positionNodes(depth = 0, index = 0) {
    // First position all children recursively to know their sizes
    let totalChildrenWidth = 0;
    let maxChildHeight = 0;

    // Position children first to calculate their dimensions
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.positionNodes(depth + 1, i);

      if (i > 0) {
        totalChildrenWidth += this.horizontalGap;
      }

      totalChildrenWidth += child.getTotalWidth();
      maxChildHeight = Math.max(maxChildHeight, child.getTotalHeight());
    }

    // Set this node's position based on index if it has a parent
    if (this.parent) {
      const siblings = this.parent.children;
      let xOffset = 0;

      for (let i = 0; i < index; i++) {
        xOffset += siblings[i].getTotalWidth() + this.horizontalGap;
      }

      this.x = this.parent.x + xOffset;
      this.y = this.parent.y + this.parent.height + this.verticalGap;
    }

    return { width: totalChildrenWidth, height: maxChildHeight };
  }

  centerChildren() {
    if (this.children.length === 0) return;

    // Get total width of all children
    let totalWidth = 0;
    for (let i = 0; i < this.children.length; i++) {
      totalWidth += this.children[i].getTotalWidth();
      if (i > 0) totalWidth += this.horizontalGap;
    }

    // Calculate starting x position to center children under the parent
    const startX = this.x + (this.width - totalWidth) / 2;

    // Position each child
    let currentX = startX;
    for (const child of this.children) {
      const childWidth = child.getTotalWidth();
      const offset = (childWidth - child.width) / 2;

      child.x = currentX + offset;
      currentX += childWidth + this.horizontalGap;

      // Recursively center each child's children
      child.centerChildren();
    }
  }

  getTotalWidth() {
    if (this.children.length === 0) return this.width;

    let totalChildrenWidth = 0;
    for (let i = 0; i < this.children.length; i++) {
      if (i > 0) totalChildrenWidth += this.horizontalGap;
      totalChildrenWidth += this.children[i].getTotalWidth();
    }

    return Math.max(this.width, totalChildrenWidth);
  }

  getTotalHeight() {
    if (this.children.length === 0) return this.height;

    let maxChildHeight = 0;
    for (const child of this.children) {
      maxChildHeight = Math.max(maxChildHeight, child.getTotalHeight());
    }

    return this.height + this.verticalGap + maxChildHeight;
  }

  drawAll(ctx: CanvasRenderingContext2D) {
    // Calculate layout first if this is the root
    if (!this.parent) {
      // Set root position
      this.x = 50;
      this.y = 50;
      this.calculateLayout();
    }

    // Draw connections first (so they appear behind nodes)
    this.drawConnections(ctx);

    // Draw this node
    this.draw(ctx);

    // Draw all children
    for (const child of this.children) {
      child.drawAll(ctx);
    }
  }

  static createSampleNodes() {
    const root = new Node("Base idea", null);
    const child1 = root.createAndAddChild("Child 1");
    const child2 = root.createAndAddChild("Child 2");
    const child3 = root.createAndAddChild("Child 2");
    const grandchild1 = child1.createAndAddChild("Grandchild 1");
    const grandchild2 = child2.createAndAddChild("Grandchild 2");
    const grandchild3 = child2.createAndAddChild("Grandchild 3");
    return root;
  }
}
