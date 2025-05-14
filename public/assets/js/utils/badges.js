$(document).ready(function () {
  // Add position indicator to section-container
  $("#section-container").append('<div class="position-indicator"></div>');

  // Add explanation note at the bottom of the section
  $("#section-container").append(
    '<div class="position-note">' +
      "<strong>Position Demo:</strong> The checkmark in the top-right corner uses " +
      "<code>position: absolute</code>. It relies on <code>position: relative</code> " +
      "on this section. If you comment out <code>position: relative</code> on " +
      "<code>#section-container</code>, the checkmark will move to the top-right of the viewport instead." +
      "</div>"
  );

  // Add toggle button to demonstrate the effect
  $("#section-container")
    .find(".position-note")
    .append(
      '<div style="margin-top: 10px;">' +
        '<button id="toggle-position" class="btn-toggle-position" ' +
        'style="background-color: var(--primary-color); color: white; border: none; ' +
        'padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">' +
        "Toggle Position Effect</button>" +
        "</div>"
    );

  // Add click handler to toggle button
  $("#toggle-position").on("click", function () {
    var sectionContainer = $("#section-container");

    // Check if position is currently relative
    if (sectionContainer.css("position") === "relative") {
      // Change to static position (same as if position:relative was commented out)
      sectionContainer.css("position", "static");
      $(this).text("Restore Position:Relative");
    } else {
      // Restore to relative
      sectionContainer.css("position", "relative");
      $(this).text("Toggle Position Effect");
    }
  });
});
