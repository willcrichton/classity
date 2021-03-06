<div class="container">
  <div class="row">
    <div class="col-md-10" id="column-left">
      <div id="notification"><span>Notice</span>: you have pending questions/answers.</div>
      
      <div class="tab-content">
        <div class="tab-pane active" id="video"></div>
        <div class="tab-pane" id="whiteboard"><canvas width="930" height="575"></canvas></div>
        <div class="tab-pane" id="presentation">
          <div class="row">
            <iframe id = "slideShowFrame" class="col-md-10"></iframe>  
          </div>
          <div id = "ssbuttons">
            <button type="button" id="download" class="btn">Download Slideshow</button>
          </div>
          <div class="arrow left"></div>
          <div class="arrow right"></div>
        </div>
      </div>
    </div>

    <div class="col-md-2" id="column-right">
      <div class="box">
        <h2>Chat</h2>
        <div id="chats"></div>
        <form id="chatbox" onsubmit="return false">
          <input type="text">
        </form>
      </div>
      <div class="box">
        <h2>Students</h2>
        <ul id="clients" class="list-group"></ul>
      </div>
      <div id="controls"></div>
    </div>
  </div>

  <div class="modal" id="join-lecture">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">Join the lecture</h4>
        </div>
        <div class="modal-body">
          <form onsubmit="return false;" id="join-form">
            <input type="text" placeholder="What's your name?" id="name">
          </form>
        </div>
        <div class="modal-footer">
          <button type="btn" class="btn" data-dismiss="modal" id="name-update">Submit</button>
        </div>
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

<div class="modal" id="posed-question">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">The instructor has asked a question</h4>
      </div>
      <div class="modal-body">
        <p id="prompt"></p>
        <table id="answers" class="table"></table>
      </div>
      <div class="modal-footer">
        <button type="btn" class="btn" data-dismiss="modal" id="question-submit">Submit</button>
      </div>
    </div>
  </div>
</div>

