<div class="container">
  <div class="row">
    <div class="col-md-8">
      <ul class="nav nav-tabs" data-tabs="tabs">
        <li class="active"><a href="#video" data-toggle="tab">Video</a></li>
        <li><a href="#whiteboard" data-toggle="tab">Whiteboard</a></li>
        <li><a href="#presentation" data-toggle="tab">Presentation</a></li>
      </ul>
      
      <div class="tab-content">
        <div class="tab-pane active" id="video"></div>
        <div class="tab-pane" id="whiteboard"><canvas></canvas></div>
        <div class="tab-pane" id="presentation"></div>
      </div>
    </div>
    <div class="col-md-3">
      <h2>Chat</h2>
    </div>
    <div class="col-md-1">
      <h2>Clients</h2>
      <ul id="clients"></ul>
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
    
