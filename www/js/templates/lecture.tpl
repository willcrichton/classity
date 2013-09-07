<div class="container">
  <div class="panel panel-default">
    <div class="panel-body">
      <div class="row">
        <div class="col-md-10" id="column-left">
          <ul class="nav nav-tabs" data-tabs="tabs">
            <li class="active"><a href="#video" data-toggle="tab">Video</a></li>
            <li><a href="#whiteboard" data-toggle="tab">Whiteboard</a></li>
            <li><a href="#presentation" data-toggle="tab">Slides</a></li>
          </ul>

          <div id="notification"><span>Notice</span>: you have pending questions/answers.</div>
          
          <div class="tab-content">
            <div class="tab-pane active" id="video"></div>
            <div class="tab-pane" id="whiteboard"><canvas width="919" height="465"></canvas></div>
            <div class="tab-pane" id="presentation">
              <div class="row">
                <iframe id = "slideShowFrame" class="col-md-10"></iframe>  
              </div>
              <div id = "ssbuttons">
                <button type="button" id="prev" class="btn">Previous</button> 
                <button type="button" id="next" class="btn">Next</button>
              </div>
            </div>
          </div>

          <div id="controls"></div>
        </div>
        <div class="col-md-2" id="column-right">
          <div class="box">
            <h2>Chat</h2>
            <div id="chats"></div>
            <form id="chatbox" onsubmit="return false">
              <input type="text" placeholder="Chat message">
            </form>
          </div>
          <div class="box">
            <h2>Students</h2>
            <ul id="clients" class="list-group"></ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal" id="join-lecture">
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

<div class="modal" id="student-question">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Student's question</h4>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <button type="btn" class="btn" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

