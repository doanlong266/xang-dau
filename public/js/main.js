$(document).ready(function () {
    fetchData();
    setInterval(fetchData, 300000);
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

function updateDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear(); // Lấy năm
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const formattedDate = `${day}/${month}/${year}`;

    const footerTime = document.querySelector('.footer .date-time .time');
    const footerDate = document.querySelector('.footer .date-time .date');
    footerTime.textContent = formattedTime;
    footerDate.textContent = formattedDate;
}
function fetchData() {
    const proxyUrl = "/proxy";

    fetch(proxyUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const table = doc.querySelector('.block-xangdau table');
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                const cardContainer = document.getElementById('cardContainer');
                cardContainer.innerHTML = '';

                const firstPriceChange = doc.querySelector('.td-gx-3');
                if (firstPriceChange) {
                    const dateMessage = firstPriceChange.textContent.trim();
                    const dateHeader = document.querySelector('h6');
                    if (dateHeader) {
                        dateHeader.textContent = `${dateMessage}`;
                    }
                }

                rows.forEach((row) => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length === 4) {
                        const matHang = cells[1].textContent.trim();
                        const gia = cells[2].textContent.trim();
                        const chenhLech = cells[3].textContent.trim();

                        let iconSrc, iconBgColor;
                        if (matHang.toLowerCase().includes('xăng')) {
                            iconSrc = '../assets/img/i-xang.svg';
                            iconBgColor = '#2bd329';
                        } else if (matHang.toLowerCase().includes('dầu')) {
                            iconSrc = '../assets/img/i-dau.svg';
                            iconBgColor = '#f59323';
                        }

                        const card = document.createElement('div');
                        card.classList.add('card');

                        const icon = document.createElement('div');
                        icon.classList.add('card-icon');
                        icon.style.backgroundColor = iconBgColor;
                        icon.innerHTML = `<img src="${iconSrc}" alt="Icon">`;

                        const content = document.createElement('div');
                        content.classList.add('card-content');

                        const title = document.createElement('h2');
                        title.textContent = matHang;

                        const price = document.createElement('p');
                        price.innerHTML = `<strong>Giá:</strong> <a class="money">${gia}</a> đồng/lít`;

                        const change = document.createElement('p');
                        if (chenhLech.toLowerCase().includes('-')) {
                            change.innerHTML = `<strong>Giảm:</strong> <span class="contact-desc">${chenhLech}</span>`;
                        }
                        else{
                            change.innerHTML = `<strong>Tăng:</strong> <span class="contact-asc" >${chenhLech}</span>`;
                        }

                        content.appendChild(title);
                        content.appendChild(price);
                        content.appendChild(change);
                        card.appendChild(icon);
                        card.appendChild(content);

                        cardContainer.appendChild(card);
                    }
                });

                console.log('Cập nhật dữ liệu từ bảng đầu tiên thành công');
            } else {
                console.error('Không tìm thấy bảng trong trang.');
            }
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('darkmode-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});
