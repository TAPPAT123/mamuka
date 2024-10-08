document.addEventListener("DOMContentLoaded", async () => {
  const telegramData = window.Telegram.WebApp.initData;
  const userId = telegramData.user_id;
  const username = telegramData.username;

  // Авторизация пользователя
  const authResponse = await fetch('http://77.232.132.67/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, username: username })
  });
  const authData = await authResponse.json();
  const token = authData.token;
  document.getElementById("score").innerText = authData.balance;

  // Отображение реферальной ссылки
  const referralLink = `http://77.232.132.67/ref/${userId}`;
  document.getElementById("referralLink").innerText = referralLink;

  // Обработчик нажатия на "тап"
  document.getElementById("circle").addEventListener("click", async () => {
      const tapResponse = await fetch('http://77.232.132.67/api/auth/tap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token })
      });
      const tapData = await tapResponse.json();
      document.getElementById("score").innerText = tapData.balance;
      
  });

  // Получение списка заданий
  const tasksResponse = await fetch('http://77.232.132.67/api/auth/tasks');
  const tasksData = await tasksResponse.json();
  const taskList = document.getElementById("taskList");

  tasksData.forEach(task => {
      const taskElement = document.createElement("a");
      taskElement.href = task.link; // Ссылка на задание
      taskElement.className = "zadanije__button-link link-zadanije";
      taskElement.setAttribute("data-task-id", task._id);
      
      taskElement.innerHTML = `
          <div class="link-zadanije__vid">
              <p>${task.description}</p>
              <p>+${task.coins}</p>
          </div>
      `;

      taskElement.addEventListener("click", async (event) => {
          event.preventDefault(); // Остановить переход по ссылке

          const completeTaskResponse = await fetch('http://77.232.132.67/api/auth/complete-task', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: token, taskId: task._id })
          });
          const completeTaskData = await completeTaskResponse.json();
          document.getElementById("score").innerText = completeTaskData.balance;
          alert(`Задание выполнено! Баланс: ${completeTaskData.balance}`);
      });

      taskList.appendChild(taskElement);
  });

  // Получение списка рефералов
  const referralsResponse = await fetch('http://77.232.132.67/api/auth/referrals', {
      headers: { 'Authorization': token }
  });
  const referralsData = await referralsResponse.json();
  const referralsList = document.querySelector(".frands__textarea ol");

  referralsData.forEach(referral => {
      const listItem = document.createElement("li");
      listItem.innerText = referral.telegramId;
      referralsList.appendChild(listItem);
  });
});



