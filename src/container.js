SVG.Container = function(element) {
  this.constructor.call(this, element)
}

// Inherit from SVG.Element
SVG.Container.prototype = new SVG.Element

//
SVG.extend(SVG.Container, {
  // Add given element at a position
  add: function(element, index) {
    if (!this.has(element)) {
      /* define insertion index if none given */
      index = index == null ? this.children().length : index
      
      /* remove references from previous parent */
      if (element.parent) {
        var i = element.parent.children().indexOf(element)
        element.parent.children().splice(i, 1)
      }
      
      /* add element references */
      this.children().splice(index, 0, element)
      this.node.insertBefore(element.node, this.node.childNodes[index] || null)
      element.parent = this
    }
    
    return this
  }
  // Basically does the same as `add()` but returns the added element
, put: function(element, index) {
    this.add(element, index)
    return element
  }
  // Checks if the given element is a child
, has: function(element) {
    return this.children().indexOf(element) >= 0
  }
  // Returns all child elements
, children: function() {
    return this._children || (this._children = [])
  }
  // Iterates over all children and invokes a given block
, each: function(block) {
    var index,
        children = this.children()
    
    for (index = 0, length = children.length; index < length; index++)
      if (children[index] instanceof SVG.Shape)
        block.apply(children[index], [index, children])
    
    return this
  }
  // Remove a child element at a position
, remove: function(element) {
    var index = this.children().indexOf(element)

    this.children().splice(index, 1)
    this.node.removeChild(element.node)
    element.parent = null
    
    return this
  }
  // Returns defs element
, defs: function() {
    return this._defs || (this._defs = this.put(new SVG.Defs(), 0))
  }
  // Re-level defs to first positon in element stack
, level: function() {
    return this.remove(this.defs()).put(this.defs(), 0)
  }
  // Create a group element
, group: function() {
    return this.put(new SVG.G())
  }
  // Create a rect element
, rect: function(width, height) {
    return this.put(new SVG.Rect().size(width, height))
  }
  // Create circle element, based on ellipse
, circle: function(size) {
    return this.ellipse(size, size)
  }
  // Create an ellipse
, ellipse: function(width, height) {
    return this.put(new SVG.Ellipse().size(width, height).move(0, 0))
  }
  // Create a line element
, line: function(x1, y1, x2, y2) {
    return this.put(new SVG.Line().attr({ x1: x1, y1: y1, x2: x2, y2: y2 }))
  }
  // Create a wrapped polyline element
, polyline: function(points) {
    return this.put(new SVG.Wrap(new SVG.Polyline())).plot(points)
  }
  // Create a wrapped polygon element
, polygon: function(points) {
    return this.put(new SVG.Wrap(new SVG.Polygon())).plot(points)
  }
  // Create a wrapped path element
, path: function(data) {
    return this.put(new SVG.Wrap(new SVG.Path())).plot(data)
  }
  // Create image element, load image and set its size
, image: function(source, width, height) {
    width = width != null ? width : 100
    return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))
  }
  // Create text element
, text: function(text) {
    return this.put(new SVG.Text().text(text))
  }
  // Create nested svg document
, nested: function() {
    return this.put(new SVG.Nested())
  }
  // Create gradient element in defs
, gradient: function(type, block) {
    return this.defs().gradient(type, block)
  }
  // Create pattern element in defs
, pattern: function(width, height, block) {
    return this.defs().pattern(width, height, block)
  }
  // Create masking element
, mask: function() {
    return this.defs().put(new SVG.Mask())
  }
  // Get first child, skipping the defs node
, first: function() {
    return this.children()[0] instanceof SVG.Defs ? this.children()[1] : this.children()[0]
  }
  // Get the last child
, last: function() {
    return this.children()[this.children().length - 1]
  }
  // Get the viewBox and calculate the zoom value
, viewbox: function() {
    /* act as a getter if there are no arguments */
    if (arguments.length == 0)
      return new SVG.ViewBox(this)
    
    /* otherwise act as a setter */
    return this.attr('viewBox', Array.prototype.slice.call(arguments).join(' '))
  }
  // Remove all elements in this container
, clear: function() {
    this._children = []
    
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild)
    
    return this
  }
  
})