<% if (admin) { %>

<button type="button" class="btn btn-lg btn-primary" id="admin-question">Pose a question <i class="glyphicon glyphicon-question-sign"></i></button>

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
