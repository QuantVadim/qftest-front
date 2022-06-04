//Разработка:
export default Object({
  URL: 'http://test-s1.ru',
  API: 'http://test-s1.ru/backend/api/main.php',
  UPLOAD_IMG_URL: "http://test-s1.ru/backend/upload.php", //Скрипт загрузки изображений
  AUTH_URL: 'http://test-s1.ru/backend/auth.php', //Скрипт авторизации через соцсети
  VK_AUTH_URL: 'https://oauth.vk.com/authorize?client_id=7870026&display=page&redirect_uri=http://localhost:8080/auth/vk&scope=offline&response_type=token&v=5.52',
  WidePages: ['/test/', '/gtest/', '/result/'], // Широкие страницы без меню навигации
});

// Для хостинга:
// export default Object({
//   URL: 'https://test-s1.ru',
//   API: 'https://test-s1.ru/backend/api/main.php',
//   UPLOAD_IMG_URL: "https://test-s1.ru/backend/upload.php", //Скрипт загрузки изображений
//   AUTH_URL: 'https://test-s1.ru/backend/auth.php', //Скрипт авторизации через соцсети
//   VK_AUTH_URL: 'https://oauth.vk.com/authorize?client_id=7870026&display=page&redirect_uri=https://test-s1.ru/auth/vk&scope=offline&response_type=token&v=5.52',
//   WidePages: ['/test/', '/gtest/', '/result/'], // Широкие страницы без меню навигации
// });