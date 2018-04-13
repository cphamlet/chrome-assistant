// create a new dag
var g = new dagreD3.graphlib.Graph().setGraph({});
//Serialization: var j = JSON.stringify(dagreD3.graphlib.json.write(g))
// g = dagreD3.graphlib.json.read(JSON.parse(j))
var currentNode = null;
var DAGS = [];
var DAG;
//select group I'm going to work in
var svg, inner; 


var tridentDag ={"root_id":"tco7ypaw8pi","current_id":"tco7ypaw8pi","nodes":{"tco7ypaw8pi":{"name":"1","url":"http://cs.unc.edu/~porter/","element_html":"<p>\nOffice: 362 Sitterson Hall<br>\nEmail: porter [at] cs {dot} unc (dot) edu <br>\nPhone/Fax: (919) 590-6044<br>\n</p>","caption":"red","id":"tco7ypaw8pi","edges":["1vzqqx08h4p"]},"1vzqqx08h4p":{"name":"2","url":"http://cs.unc.edu/~porter/","element_html":"<p>\nDepartment of Computer Science<br>\nUniversity of North Carolina at Chapel Hill <br>\nCampus Box 3175, Brooks Computer Science Building<br>\nChapel Hill, NC 27599-3175 <br>\n</p>","caption":"blue","id":"1vzqqx08h4p","edges":["t7s9bsuxo6c"]},"t7s9bsuxo6c":{"name":"3","url":"http://cs.unc.edu/~porter/","element_html":"<p>\nPh.D. in Computer Science, <a href=\"http://www.utexas.edu\">The University of Texas at Austin,</a> 2010.<br>\nM.S. in Computer Science, <a href=\"http://www.utexas.edu\">The University of Texas at Austin,</a> 2007.<br>\nB.A. in Computer Science and Mathematics, <a href=\"http://www.hendrix.edu\">Hendrix College,</a> 2003.<br>\n</p>","caption":"green","id":"t7s9bsuxo6c","edges":["ex163y27q3c"]},"ex163y27q3c":{"name":"4","url":"http://cs.unc.edu/~porter/","element_html":"<p>My research develops better abstractions for managing concurrency and\nsecurity, primarily in the operating system, and extends these abstractions to other portions of the\ntechnology stack as appropriate.</p>","caption":"orange","id":"ex163y27q3c","edges":["22goctl2pc8"]},"22goctl2pc8":{"name":"5","url":"http://cs.unc.edu/~porter/","element_html":"<p>\n  During Fall 2017, I am a Visiting Assistant Professor\n  at <a href=\"http://www.gsd.inesc-id.pt/\">the Distributed Systems\n  Group</a> at <a href=\"https://tecnico.ulisboa.pt/\">Instituto Superior Técnico</a>.\n  </p>","caption":"ok","id":"22goctl2pc8","edges":[]}}};
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
function run() {
    svg = d3.select("svg"),
    inner = svg.select("g");
   // svg.call(zoom);
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
        var node = new Node(123, "http://google.com", "hello_World", "html");
        var parent = currentNode;
        DAG.addChild(currentNode, node);
    }
    addChildToGraph(tridentDag);
}

function addChildToGraph(currDAG) {

    //Add to g
    for(var currNode in currDAG.nodes) {
       g.setNode(currNode, { shape: 'circle', id:currNode, label:""}); 
    }
    //Connect dag
    connectDAG(currDAG, currDAG.nodes[currDAG.root_id]);
    update();
    setColor();
}
/******Helper Fns**************/
// Run the renderer. This is what draws the final graph.
// Recursively Connect all nodes to their children in the graph g
function connectDAG(currDAG, currNode) {
    if(currNode.edges == undefined || currNode.edges.length == 0 ) {
        return;
    }
    for(var i = 0; i < currNode.edges.length; i++) {
        g.setEdge(currNode.id, currNode.edges[i], { label: ""});
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



    var maker_space = null; 
    var nodeL = inner.selectAll("g.nodes")._groups[0][0].childNodes;
    var isMouseDown = false;
    //On releasing mouse, clear all node colors
    //
    document.onmouseup = function(){
        isMouseDown = false;
        //clears all node's colros on click up
        nodeL.forEach((node_i) => {
            node_i.children[0].style = "fill:clear";
        });
    };
    for(var i = 0; i < nodeL.length; i++) {
        nodeL[i].addEventListener("mousedown",function(e){
            isMouseDown = true;
            var node_id_clicked_on = e.target.parentNode.id;
            maker_space = node_id_clicked_on;
            e.target.style = "fill:green";
        });
        nodeL[i].addEventListener("mouseenter",function(e){
            var node_id_mouseentered_on = e.target.id;
            if(!isMouseDown){
                e.target.children[0].style = "fill:green";
            }else if(maker_space != node_id_mouseentered_on){
                console.log("Enter");
                e.target.children[0].style = "fill:red";
            }
        });
        nodeL[i].addEventListener("mouseleave",function(e){
            
            var node_id_mouseentered_on = e.target.id;
            console.log("leave");
            if(maker_space != node_id_mouseentered_on || maker_space == null){
                e.target.children[0].style = "fill:clear";
            }
        });
        nodeL[i].addEventListener("mouseup", function(e){
            var node_id_mousereleased_on = e.target.parentNode.id;
            if(maker_space != null && maker_space!=node_id_mousereleased_on){
                var node_id_hovered_on = e.target.id;
                console.log("Linked: "+maker_space+" to: "+node_id_mousereleased_on);
                g.setEdge(maker_space, node_id_mousereleased_on, { label: ""});
                update();
                maker_space = null;
            }
        });
    }
    
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