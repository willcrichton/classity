<div class="shout">
  <div class="container">
    <div class="bg">
      <h1>Real-time lectures on the web.</h1>
      <div class="row">
        <div class="col-md-2">
          <button class="btn btn-success" data-toggle="modal" href="#modal"><i class="glyphicon glyphicon-plus"></i> Create a new lecture</button>
        </div>
        <div class="col-md-1" style="margin-left:70px;font-size:26px;"> OR </div>
        <div class="col-md-3">
          <div class="input-group">
            <input class="form-control" type="text" placeholder="Lecture #" id="id">
            <div class="input-group-btn">
              <input type="submit" class="btn btn-default" value="Join" id="join">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-md-3 well">
      <h2>Anytime, Anywhere</h2>
      <p>Couldn't make it to school? Guest lecturing from another continent? Classity can do remote lectures with students and teachers around the world.
    </div>
    <div class="col-md-4 col-md-offset-1 well">
      <h2>Student Interactivity</h2>
      <p>Most virtual classrooms either lack a real teacher or true interactivity with the student. Classity offers both to keep the students involved as you teach.
    </div>
    <div class="col-md-3 col-md-offset-1 well">
      <h2>Developed for Educators</h2>
      <p>Never worry about having to use Skype or Hangouts for educational purposes again. Classity caters to your needs as a teaching professional.
    </div>
  </div>
</div>

<div class="modal" id="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Lecture settings</h4>
      </div>
      <div class="modal-body">
        <input type="text" placeholder="Your name" id="name"><br /><br />
        To use a PowerPoint, load it from your Google Drive.<br />
        <button class="btn" id="pick">Choose PPT</button> <span id="ppt"></span>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" id="new" data-dismiss="modal">Create</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
