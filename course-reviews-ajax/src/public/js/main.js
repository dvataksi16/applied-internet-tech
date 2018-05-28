function addRow(name, semester, year, review){
  const row = document.querySelector('tbody').appendChild(document.createElement('tr'));
  const nameColumn = row.appendChild(document.createElement('td'));
  nameColumn.textContent = name;
  const semesterColumn = row.appendChild(document.createElement('td'));
  semesterColumn.textContent = semester;
  const yearColumn = row.appendChild(document.createElement('td'));
  yearColumn.textContent = year;
  const reviewColumn = row.appendChild(document.createElement('td'));
  reviewColumn.textContent = review;
}
function handleClick(evt) {
  console.log('inside handle click');
    evt.preventDefault();
    const name = document.querySelector("#name").value;
    const semester = document.querySelector("#semester").value;
    const year = document.querySelector("#year").value;
    const review = document.querySelector("#review").value;

    // get the value from the text input
    const query = "name="+document.forms['create'].name.value + "&semester=" +document.forms['create'].semester.value
      +"&year="+document.forms['create'].year.value+"&review="+document.forms['create'].review.value;
    // post to api end point
    const req = new XMLHttpRequest();
    // configure the request
    req.open('POST', '/api/reviews/create',true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.addEventListener('load', function(evt) {
        evt.preventDefault();
        console.log(req.status, req.responseText);
        if(req.status >= 200 && req.status < 300) {
          addRow(name,semester,year,review);
        }
    });

    // construct the body of our request
    // name=value
    // create body so that it fits expected format
    req.send(query);
  }

function getReviews() {
  console.log('inside get Reviews');
    const req = new XMLHttpRequest();
    const url = 'api/review';
    console.log(url);
    req.open('GET', url, true);
    req.addEventListener('load', function(evt) {
        evt.preventDefault();
        console.log(req.status, req.responseText);
        if(req.status >= 200 && req.status < 300) {
            const reviews = JSON.parse(req.responseText);

            // table.removeChild(table.do);
            //   console.log("removed");
            //}
            for(const r of reviews) {
                addRow(r.name,r.semester,r.year,r.review);
            }
          }
    });
    req.send();
  }
function main() {
    console.log('inside main');
    getReviews();
    // TODO: retrieve messages and display
    // add event listener to button
    const req = new XMLHttpRequest();
    const url = 'api/places';
    req.open('GET', url, true);

    const addBtn = document.querySelector("#addBtn");
    addBtn.addEventListener('click', handleClick);
    const filterBtn = document.querySelector('#filterBtn');
    filterBtn.addEventListener('click',function(evt){
      console.log('inside handle filter');
      evt.preventDefault();
      const filteredSem = document.querySelector("#filterSemester").value;
      const filteredYear = document.querySelector("#filterYear").value;
      const filteredQuery = "semester=" + filteredSem + "&year=" + filteredYear;
      console.log(filteredQuery);
      const req = new XMLHttpRequest();
      req.open('GET', "/api/review?" + filteredQuery, true);
      req.addEventListener('load', function(inner) {
        inner.preventDefault();
        if(req.status >= 200 && req.status < 300) {
          const reviews = JSON.parse(req.responseText);
          const table = document.querySelector('tbody');
          const tableRows = table.getElementsByTagName('tr');

          console.log(table.getElementsByTagName('tr').length);
          for(let i = tableRows.length - 1; i >=0; i-- ){
            table.removeChild(tableRows[i]);
            console.log('pls print');
          }
          for(const r of reviews) {
              addRow(r.name,r.semester,r.year,r.review);
          }
        }
      });
      req.send();
    });
}



document.addEventListener("DOMContentLoaded", main);
