$(document).ready(function() {
  fetchData();
  setInterval(fetchData, 300000);
});

function fetchData() {
  const proxyUrl = "/api/proxy"; 

  fetch(proxyUrl)
      .then(response => response.text())
      .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const tables = doc.getElementsByTagName('table');

          if (tables.length > 0) {
              const table = tables[0]; 
              const rows = table.getElementsByTagName('tr');
              const tbody = document.getElementById('priceTable').getElementsByTagName('tbody')[0];
              tbody.innerHTML = '';

              let message = ""; 

              for (let row of rows) {
                  const cells = row.getElementsByTagName('td');
                  let rowData = [];

                  for (let cell of cells) {
                      rowData.push(cell.textContent.trim());
                  }

                  if (rowData.length === 3) {
                      const [matHang, gia, soVoiKyTruoc] = rowData;
                      if (matHang !== "Mặt hàng") {
                          message += `${matHang}: ${gia} đồng. (Tăng ${soVoiKyTruoc} đồng)\n\n`;
                      }

                      const displayRow = document.createElement('tr');
                      rowData.forEach(data => {
                          const displayCell = document.createElement('td');
                          displayCell.textContent = data;
                          displayRow.appendChild(displayCell);
                      });
                      tbody.appendChild(displayRow);
                  }
              }

              console.log(`Message to chat_id: ${encodeURIComponent(message)}`);
              console.log(`Cập nhật ngày ${new Date().toLocaleDateString()} từ VnExpress.`);
          } else {
              console.error('No tables found in the fetched HTML.');
          }
      })
      .catch(error => console.error('Error:', error));
}
