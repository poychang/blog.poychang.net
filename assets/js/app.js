$(document).ready(function () {

  /* Sidebar height set */
  $('.sidebar').css('min-height', $(document).height());

  /* Secondary contact links */
  var scontacts = $('#contact-list-secondary');
  var contact_list = $('#contact-list');

  scontacts.hide();

  contact_list.mouseenter(function () { scontacts.fadeIn(); });

  contact_list.mouseleave(function () { scontacts.fadeOut(); });

//   // input keyword in sidebar-search-box when key down
//   document.onkeydown = function (event) {
//     var azKeySet = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
//     var AZKeySet = [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];

//     if (!event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
//       if (azKeySet.indexOf(event.keyCode) > -1 || AZKeySet.indexOf(event.keyCode) > -1) {
//         // only keyCode is a-z or A-Z
//         document.getElementById("sidebar-search-box").focus();
//       }
//       if (event.keyCode === 27) { // Esc
//         document.getElementById("sidebar-search-box").blur();
//       }
//     }
//   };
});
