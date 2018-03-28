// This is the main JSON object which holds a tutorial. 

"use strict";
var dag = new DAG();
var rS = new recordingStream();

//The recording stream is a temporary stream which is recorded. It is then merged into the DAG
function recordingStream(){
  this.steps = [];
  this.name = "";
  this.insertStep = function(step_obj /*{id: "random generated id", name: "", url: "", element_html: "", caption: ""}*/){
    this.steps.push(step_obj); //Adds step obj as a node into the steps array
    if(this.steps.length > 1){
        //Gives the previously inserted node an outgoing edge to this newly inserted node.
        this.steps[this.steps.length-2].insertEdge(step_obj.id);
    }
  }
  this.clear = function(){
    this.steps = [];
    this.name = "";
  } 
}

//TODO: Convert recording stream to JSON 
//This overwrites the JSON.stringify(recordingStreamObj) function, and converts the recordingStream Object into a JSON.  
recordingStream.prototype.toJSON = function (key){
  return {name: this.name, current_step_index: this.current_step_index, steps: this.steps }; // everything that needs to get stored
};


//This is a DAG data structure
function DAG() {
  /*Fields*/
  this.dagName = "";
  this.nodes = {};
  this.root_id = "";
  this.current_id = "";
  //A path of the nodes you are on.
  this.current_path = [];
  /*Functions*/
  this.addChild = function( parent_id /*<-ID to link from value = {id: "", name: "", url: "", element_html: "", caption: ""}*/, 
                  inserted_node ) {

    //If the DAG is empty, there is no parent. Insert first node.
    if(Object.keys(this.nodes).length == 0){
      this.nodes[inserted_node.id] = inserted_node;
    }else {
      //If the item was already inserted. Don't insert again!
      if(this.nodes[inserted_node.id]){
        console.log("Cannot insert the same item twice.");
        return;
      }
      this.nodes[inserted_node.id] = inserted_node;
      this.addLink(parent_id, inserted_node.id);
    }
     
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

  //Merges the recording stream into the DAG. 
  //This will link a linear recording stream to a node already present in the DAG.
  //If the parent name provided is null, then it will insert into the DAG with no parent
  //Call: this.merge_rs
  this.merge_rs = function(recording_stream_obj, parent_id){
    let inserted_stream_id = recording_stream_obj.steps[0].id;

      //Inserts each step in stream into DAG. 
      for(let i = 0; i < recording_stream_obj.steps.length; i++){
          let step_obj = recording_stream_obj.steps[i];
          this.nodes[step_obj.id] = step_obj;
      }
      //If the parent id is undefined, this means it is the FIRST merge.
      //When you are in the first merge, the "current" node is set to the root node. The beginning!
      if(typeof parent_id  == 'undefined'){
          this.root_id = inserted_stream_id;
          this.current_id = this.root_id;
      }else
      //Otherwise, link parent to newly insreted stream
          this.nodes[parent_id].insertEdge(inserted_steam_id);
      }
  
  //Pops item off current path, gets prev node. 
  this.get_prev = function(){
    let prev_node = this.current_path.pop();
    this.current_id = prev_node.id;
    return prev_node;
  }

  this.get_next = function(next_id){
    //Adds id into "visited" path. Used for going to previous node
     this.current_path.push(this.current_id);
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
    this.current_path = [];
  }

}

DAG.prototype.toJSON = function (key){
  return {root_id: this.root_id, current_id: this.current_id, nodes: this.nodes }; // everything that needs to get stored
};
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
Node.prototype.toJSON = function (key){
  return {name: this.name, url: this.url, element_html:this.element_html, caption:this.caption, id:this.id, edges:this.edges }; // everything that needs to get stored
};

//This global variable is meant to maintain the button state across refreshed pages. For example, when you
//advance to the next link, you will maintain the button on the bottom right.  
//This should probably be cleaned up and not be global. 
var load_status = false;

//"element_html" : <html here>
//"entered_text" : This is the text the professor entered

//This background listener listens for comamnds from the content script. The commands are:
//Get: this returns the first itme in the stack
//Send: This adds an item to the stack
//Save: Right now this saves the recording stream and merges it into the DAG. In the future, a visualizaiton should\
//merge the DAG.
//Clear: This empties all of the items in the DAG and recording stream. (Say)
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    switch(request.command){
            
            
        case "addName": 
        dag.dagName = request.tutorial_name;
        sendResponse({msg: "adding name", tutorial:dag});  
        break;
            
        case "peek": 
        sendResponse({msg: "Background: sending top element from background script", tutorial:dag});  
        break;

        case "get_next":
        dag.get_next(request.next_id);
        sendResponse({msg: "Background: sending next element from background script", tutorial:dag});

        console.log("got next");
        break;

        case "get_prev":
        let g = dag.get_prev();
        console.log(g);
        sendResponse({msg:"", prev_node:dag.get_prev()});
        //returns outgoing edges of the current node. 

        break;

        case "get_options":
        sendResponse({msg: "", options:dag.nodes[dag.current_id].edges});
        break;
        //This case is only used when recording steps. Adds a step to tutorial.
        case "record_action":
        let inserted_node = new Node(request.title_text, request.url, request.entered_text, request.element_html);
        rS.insertStep( inserted_node );
        sendResponse({msg: "Background: Message received", enteredText:request.entered_text});
        break;

        //Sends the tutorial object to the content script
        case "save":
        //Clicking the "save" button ends the recording stream.
        dag.merge_rs(rS);
        //Clears recording stream;
        rS.clear();
        sendResponse("Save complete");
        break; 

        //Deletes the recording
        case "clear":
        console.log("Background script: clicked clear button");
        rS.clear();
        dag.clear();
        sendResponse("Clear complete");
        break; 
        
        case "get-load-status":
        sendResponse(load_status);
        break; 

        case "set-load-status":
        load_status = !load_status;
        sendResponse(load_status);
        console.log(JSON.stringify(dag));
        break;
        
        default: 
        break;
    }


  });





