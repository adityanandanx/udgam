/* eslint-disable @typescript-eslint/no-unused-vars */
export class Node {
  public id = 0;
  public x = 0;
  public y = 0;
  public width = 180;
  public height = 60;
  public padding = 10;
  public horizontalGap = 50; // Now acts as gap between parent and child
  public verticalGap = 30; // Now acts as gap between siblings
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

      // Start from the right center of this node
      const startX = this.x + this.width;
      const startY = this.y + this.height / 2;

      // End at the left center of the child node
      const endX = child.x;
      const endY = child.y + child.height / 2;

      // Create a curved path between nodes
      const controlPointX = (startX + endX) / 2;

      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(controlPointX, startY, controlPointX, endY, endX, endY);

      ctx.stroke();
    }
  }

  calculateLayout() {
    this.positionNodes();
    this.centerChildren();
  }

  positionNodes(depth = 0, index = 0) {
    // First position all children recursively to know their sizes
    let maxChildWidth = 0;
    let totalChildrenHeight = 0;

    // Position children first to calculate their dimensions
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.positionNodes(depth + 1, i);

      if (i > 0) {
        totalChildrenHeight += this.verticalGap;
      }

      totalChildrenHeight += child.getTotalHeight();
      maxChildWidth = Math.max(maxChildWidth, child.getTotalWidth());
    }

    // Set this node's position based on index if it has a parent
    if (this.parent) {
      const siblings = this.parent.children;
      let yOffset = 0;

      for (let i = 0; i < index; i++) {
        yOffset += siblings[i].getTotalHeight() + this.verticalGap;
      }

      this.x = this.parent.x + this.parent.width + this.horizontalGap;
      this.y = this.parent.y + yOffset;
    }

    return { width: maxChildWidth, height: totalChildrenHeight };
  }

  centerChildren() {
    if (this.children.length === 0) return;

    // Get total height of all children
    let totalHeight = 0;
    for (let i = 0; i < this.children.length; i++) {
      totalHeight += this.children[i].getTotalHeight();
      if (i > 0) totalHeight += this.verticalGap;
    }

    // Calculate starting y position to center children next to the parent
    const startY = this.y + (this.height - totalHeight) / 2;

    // Position each child
    let currentY = startY;
    for (const child of this.children) {
      const childHeight = child.getTotalHeight();
      const offset = (childHeight - child.height) / 2;

      child.y = currentY + offset;
      currentY += childHeight + this.verticalGap;

      // Recursively center each child's children
      child.centerChildren();
    }
  }

  getTotalWidth() {
    if (this.children.length === 0) return this.width;

    let maxChildWidth = 0;
    for (const child of this.children) {
      maxChildWidth = Math.max(maxChildWidth, child.getTotalWidth());
    }

    return this.width + this.horizontalGap + maxChildWidth;
  }

  getTotalHeight() {
    if (this.children.length === 0) return this.height;

    let totalChildrenHeight = 0;
    for (let i = 0; i < this.children.length; i++) {
      if (i > 0) totalChildrenHeight += this.verticalGap;
      totalChildrenHeight += this.children[i].getTotalHeight();
    }

    return Math.max(this.height, totalChildrenHeight);
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
    const grandchild1 = child1.createAndAddChild(
      "Grandchild 1 hello world this is a very long text"
    );
    const grandchild2 = child2.createAndAddChild("Grandchild 2");
    const grandchild3 = child2.createAndAddChild("Grandchild 3");
    return root;
  }
}
