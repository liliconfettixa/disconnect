/*
  A script that catches errors and reports them to Disconnect servers.

  Copyright 2010-2014 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Eason Goodale <eason.goodale@gmail.com>
*/

window.onerror = function (message, filename, linenumber) {
  console.log("message: " + message + " linenumber: " + linenumber);
  try {
    var filename = filename.substr(filename.lastIndexOf('/') + 1);
    $.get("https://disconnect.me/error/d2/" + CURRENT_BUILD + "/" + linenumber + "/" + filename);
  }
  catch(e) {
    $.get("https://disconnect.me/error/d2/" + linenumber);
  }
  return true;
};
