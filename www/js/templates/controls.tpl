<% if (admin) { %>

<button type="button" class="btn btn-lg btn-primary" id="admin-question" data-toggle="modal" href="#admin-modal">Pose a question <i class="glyphicon glyphicon-question-sign"></i></button>

<div class="modal" id="admin-modal">
    <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Pose a Question</h4>
      </div>
      <div class="modal-body">
        <form class="form-horizontal" onsubmit="return false;">
          <div class="form-group">
            <label for="posePrompt" class="col-md-2 control-label">Prompt</label>
            <div class="col-md-10">
              <input type="text" class="form-control" id="posePrompt" placeholder="Question prompt">
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-2">
              <label class="control-label">Answers</label>
              <button class="btn btn-xs" id="add-answer" style="position: relative; left: 25px;"><i class="glyphicon glyphicon-plus"></i></button>
            </div>
            <div id="answers" class="col-md-10"></div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn" id="pose-question" data-dismiss="modal">Pose Question</button>
      <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<% } else { %>

<button type="button" class="btn btn-lg btn-primary" id="student-question" data-toggle="modal" href="#question-modal">Ask a question <i class="glyphicon glyphicon-question-sign"></i></button>
<button type="button" class="btn btn-lg btn-success" id="student-answer" data-toggle="modal" href="#answer-modal">Give an answer <i class="glyphicon glyphicon-ok"></i></button>

<div class="modal" id="question-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Ask a Question</h4>
      </div>
      <div class="modal-body">
        <textarea id="question-text" placeholder="Type your question here" style="width: 100%; height: 75px;"></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" id="ask-question" data-dismiss="modal">Send Question</button>
      <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<div class="modal" id="answer-modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Answer a Question</h4>
      </div>
      <div class="modal-body">
        <textarea id="answer-text" placeholder="Type your answer here" style="width: 100%; height: 75px;"></textarea>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" id="answer-question" data-dismiss="modal">Submit Answer</button>
      <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<% } %>
