// create a new dag
var g = new dagreD3.graphlib.Graph().setGraph({});
var currentNode = null;
var DAGS = [];
var DAG;
//select group I'm going to work in
var svg, inner; 

// Set up zoom support
var zoom = d3.zoom().on("zoom", function() {
    inner.attr("transform", d3.event.transform);
});


// Create the renderer
var render = new dagreD3.render();

// Click event for nodes
var toggleCurrentNode = function(e) {
    //check object. **Note will likely change when label of nodes are changed from ID number
    var labelVal;
    if(e.path[0].nodeName == "tspan") {
        labelVal = e.path[0].innerHTML;
    }
    else {
        labelVal = e.path["0"].nextSibling.childNodes["0"].firstChild.childNodes["0"].innerHTML
    }
    if(currentNode == labelVal) { 
        currentNode = null; 
    }
    else { 
        currentNode = labelVal; 
    }
    setColor();
    
}

/**************test code***************/
window.onload = run;
function toggleRightMenu() {
    var menu = document.getElementById("ctxmenu");
    menu.className = "hide";
}
function customRightClick() { 
    document.addEventListener('click', toggleRightMenu, false);
    var addNode = document.getElementById("addNode");
    addNode.addEventListener('click', function(e) { addChildToGraph(DAG); });
    var delNode = document.getElementById("delNode");
    delNode.addEventListener('click', function(e) { removeNode(); });
}
function run() {
    svg = d3.select("svg"),
    inner = svg.select("g");
    inner.call(zoom);
    customRightClick();
    test();
}
function test() {
    DAG = new DAG();
    populateDAG(3);   
}

/*************************************************/
function populateDAG(elems) {
    console.log("Populating DAG with " + elems + " nodes");
    for(var i = 0; i < elems; i++) {
        addChildToGraph(DAG);
    }
}

/******Helper Fns**************/
// Run the renderer. This is what draws the final graph.
// Recursively Connect all nodes to their children in the graph g
function connectDAG(currDAG, currNode) {
    if(currNode.edges == undefined || currNode.edges.length == 0 ) {
        return;
    }
    for(var i = 0; i < currNode.edges.length; i++) {
//        console.log(currNode.edges[i]);
        g.setEdge(currNode.id, currNode.edges[i], { label: i});
        connectDAG(currDAG, currDAG.nodes[currNode.edges[i]]);
    }
    
}
function setColor() {
    var allNodes = inner.select("g.nodes");
    //get all nodes.
    //toggle color if current selection or not
    //change their class to current selection or not
    var listOfNodes = allNodes._groups[0][0].childNodes;
    for(var i = 0; i < listOfNodes.length; i++) {
        var currLabel = listOfNodes[i].childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerHTML,
            color =  (currLabel == currentNode) ? 'green' : 'white';
        listOfNodes[i].childNodes[0].style = "fill:" + color;
    }
}
function update() {
    render(inner, g);
    attachEventListener();
}
function attachEventListener() {
    var nodeL = inner.selectAll("g.nodes")._groups[0][0].childNodes;
    for(var i = 0; i < nodeL.length; i++) {
        nodeL[i].addEventListener("click", function(e) {
            toggleCurrentNode(e);
        });
        nodeL[i].addEventListener('contextmenu', function(e) {
                // here you draw your own menu
                var menu = document.getElementById("ctxmenu");
                menu.classList.toggle("hide");
//                menu.style.position = absolute;
                menu.style.left = e.clientX+'px';
                menu.style.top = e.clientY+'px';
                
                e.preventDefault();
            }, false);
        nodeL[i].addEventListener('contextmenu', function(e) { 
            var labelVal;
            if(e.path[0].nodeName == "tspan") {
                labelVal = e.path[0].innerHTML;
            }
            else {
                labelVal = e.path["0"].nextSibling.childNodes["0"].firstChild.childNodes["0"].innerHTML
            }
            currentNode = labelVal;
            setColor();
        });
       
    }
    
}
function addChildToGraph(currDAG) {
    var node = new Node(123, "http://google.com", "hello_World", "html");
    var parent = currentNode;
    currDAG.addChild(currentNode, node);
    //add to g
    for(var currNode in currDAG.nodes) {
       g.setNode(currNode, { shape: 'circle'}); 
    }
    // connect dag
    connectDAG(currDAG, currDAG.nodes[currDAG.root_id]);
    update();
    setColor();
}

//remove edge for delID from DAG
function removeEdge(currDAG, currNode, delID) {
    currNode.edges = currNode.edges.filter(edge => edge != delID);
    for(var edge in currNode.edges) {
        removeEdge(currDAG, currDAG.nodes[currNode.edges[edge]], delID);
    }
}

//remove node from DAG and graph
function removeNode() {
    if(DAG.root_id == currentNode) {
        DAG.root_id = DAG.nodes[currentNode].edges[0];
    }
    delete DAG.nodes[currentNode];
    removeEdge(DAG, DAG.nodes[DAG.root_id], currentNode);
    g.removeNode(currentNode);
    currentNode = null;
    update();
    setColor();
}
/***********Code From Background Script*************/
function DAG() {
  /*Fields*/
  this.nodes = {};
  this.root_id = "";
  this.current_id = "";

  /*Functions*/
  this.addChild = function( parent_id /*<-ID to link from value = {id: "", name: "", url: "", element_html: "", caption: ""}*/, 
                  inserted_node ) {

    //If the DAG is empty, there is no parent. Insert first node.
    if(Object.keys(this.nodes).length == 0){
      this.nodes[inserted_node.id] = inserted_node;
        this.root_id = inserted_node.id;
    }else{  

      //If the item was already inserted. Don't insert again!
      if(this.nodes[inserted_node.id]){
        console.log("Cannot insert the same item twice.");
        return;
      }
      this.nodes[inserted_node.id] = inserted_node;
      this.addLink(currentNode, inserted_node.id);
    }
     currentNode = inserted_node.id;
  }
  //This function draws an edge from one step to another
  this.addLink = function(link_from_id, link_to_id){
    //Error checking;
    if(typeof link_from_id  == 'undefined' || typeof this.nodes[link_from_id] == 'undefined' || typeof link_to_id == 'undefined'){
        console.log("Error, node linking_from_id is undefined! Cannot not insert node.");
        return;
    }
      this.nodes[link_from_id].insertEdge(link_to_id);
  }
  this.get_next = function(next_id){
     let selected_id_is_present_in_edges = false;
     //Iterates over all edges in current node
     this.nodes[this.current_id].edges.forEach(function(edge){
         if(edge == next_id){
          selected_id_is_present_in_edges = true;
          return;
         }
     });
     if(!selected_id_is_present_in_edges){
       console.log("Error: Requested id in get_next function is not present.");
       return null;
     }
    //Advance the pointer to next_id, and return that node.
     this.current_id = next_id;
     return this.nodes[this.current_id];
  }
  this.get_current = function(){
    return this.nodes[this.current_id];
  }

  this.clear = function(){
    this.nodes = {};
    this.current_id = "";
    this.root_id = "";
  }

}
//The step object 
function Node(name, url, caption, element_html){
  //Traditional fields
  this.name = name;
  this.url = url;
  this.element_html = element_html;
  this.caption = caption;
  this.id = Math.random().toString(36).slice(2); //Outputs a random identification string  
  //DAG functionalities
  //These are the outgoing edges
  this.edges = []; 
  this.insertEdge = function(node_id){ 
    //TODO: Check for duplicate edges in array. 
     this.edges.push(node_id);
  }
}