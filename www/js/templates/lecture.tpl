<div class="container">
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-7">
          <ul class="nav nav-tabs" data-tabs="tabs">
            <li class="active"><a href="#video" data-toggle="tab">Video</a></li>
            <li><a href="#whiteboard" data-toggle="tab">Whiteboard</a></li>
            <li><a href="#presentation" data-toggle="tab">Presentation</a></li>
          </ul>
          
          <div class="tab-content">
            <div class="tab-pane active" id="video"></div>
            <div class="tab-pane" id="whiteboard"><canvas width="634" height="400"></canvas></div>
            <div class="tab-pane" id="presentation">
              <iframe id = "slideShowFrame" class="col-md-10"></iframe>  
              <div id = "ssbuttons">
                <button type="button" id="prev" class="btn">Previous</button> 
                <button type="button" id="next" class="btn">Next</button>
                <!-- <button type="button" id="pickNew" class="btn">Pick New File</button>  This needs to be right aligned-->
              </div>
            </div>
          </div>

          <div id="controls"></div>
        </div>
        <div class="col-md-3">
          <h2>Chat</h2>
          <form id="chatbox">
            <input type="text" placeholder="Chat message">
          </form>
          <div id="chats"></div>
        </div>
        <div class="col-md-2">
          <h2>Clients</h2>
          <ul id="clients" class="list-group"></ul>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Join the lecture</h4>
      </div>
      <div class="modal-body">
        <input type="text" placeholder="What's your name?" id="name">
      </div>
      <div class="modal-footer">
        <button type="btn" class="btn" data-dismiss="modal" id="name-update">Submit</button>
      </div>
    </div>
  </div>
</div>

