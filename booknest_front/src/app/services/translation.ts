import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'ru' | 'en' | 'kk';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('ru');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Translations = {
    // Header
    'header.search': {
      ru: 'Поиск книг...',
      en: 'Search books...',
      kk: 'Кітаптарды іздеу...'
    },
    'header.profile': {
      ru: 'Профиль',
      en: 'Profile',
      kk: 'Профиль'
    },
    'header.createChart': {
      ru: 'Создать чарт',
      en: 'Create Chart',
      kk: 'Чарт жасау'
    },
    'header.logout': {
      ru: 'Выход',
      en: 'Logout',
      kk: 'Шығу'
    },
    'header.login': {
      ru: 'Войти',
      en: 'Login',
      kk: 'Кіру'
    },

    // Home Page
    'home.title': {
      ru: 'Добро пожаловать в BookNest!',
      en: 'Welcome to BookNest!',
      kk: 'BookNest-ке қош келдіңіз!'
    },
    'home.subtitle': {
      ru: 'Ваша личная библиотека в кармане. Читайте, открывайте и делитесь книгами с миллионами читателей по всему миру.',
      en: 'Your personal library in your pocket. Read, discover and share books with millions of readers around the world.',
      kk: 'Сіздің жеке кітапханаңыз қалтаңызда. Әлем бойынша миллиондаған оқырмандармен кітаптарды оқыңыз, ашыңыз және бөлісіңіз.'
    },
    'home.startReading': {
      ru: 'Начать чтение',
      en: 'Start Reading',
      kk: 'Оқуды бастау'
    },
    'home.whyBookNest': {
      ru: 'Почему BookNest?',
      en: 'Why BookNest?',
      kk: 'Неліктен BookNest?'
    },
    'home.feature1Title': {
      ru: 'Огромная библиотека',
      en: 'Huge Library',
      kk: 'Үлкен кітапхана'
    },
    'home.feature1Desc': {
      ru: 'Тысячи книг различных жанров на любой вкус',
      en: 'Thousands of books of various genres for every taste',
      kk: 'Әртүрлі жанрдағы мыңдаған кітаптар'
    },
    'home.feature2Title': {
      ru: 'Персонализация личного профиля',
      en: 'Personalization of Personal Profile',
      kk: 'Жеке профильдін жекелендіру'
    },
    'home.feature2Desc': {
      ru: 'Создавайте свои коллекции и делитесь рекомендациями',
      en: 'Create your collections and share recommendations',
      kk: 'Өз жинақтарыңызды жасаңыз және ұсыныстар алыңыз'
    },
    'home.feature3Title': {
      ru: 'Умный поиск',
      en: 'Smart Search',
      kk: 'Ақылды іздеу'
    },
    'home.feature3Desc': {
      ru: 'Расширенные фильтры для быстрого поиска нужной книги',
      en: 'Advanced filters for quick search of the right book',
      kk: 'Қажетті кітапты жылдам іздеу үшін кеңейтілген сүзгілер'
    },
    'home.feature4Title': {
      ru: 'Автосохранение',
      en: 'Auto-save',
      kk: 'Автосақтау'
    },
    'home.feature4Desc': {
      ru: 'Продолжайте чтение с того места, где остановились',
      en: 'Continue reading from where you left off',
      kk: 'Тоқтаған жеріңізден оқуды жалғастырыңыз'
    },
    'home.popularCollections': {
      ru: 'Популярные подборки',
      en: 'Popular Collections',
      kk: 'Танымал жинақтар'
    },
    'home.viewCollection': {
      ru: 'Смотреть подборку →',
      en: 'View Collection →',
      kk: 'Жинақты көру →'
    },
    'home.ctaTitle': {
      ru: 'Готовы начать своё читательское путешествие?',
      en: 'Ready to start your reading journey?',
      kk: 'Оқу саяхатыңызды бастауға дайынсыз ба?'
    },
    'home.ctaSubtitle': {
      ru: 'Присоединяйтесь к тысячам читателей уже сегодня',
      en: 'Join thousands of readers today',
      kk: 'Мыңдаған оқырмандарға бүгін қосылыңыз'
    },
    'home.registerFree': {
      ru: 'Зарегистрироваться бесплатно',
      en: 'Register for Free',
      kk: 'Тегін тіркелу'
    },

    // Dashboard
    'dashboard.myProfile': {
      ru: 'Мой профиль',
      en: 'My Profile',
      kk: 'Менің профилім'
    },
    'dashboard.edit': {
      ru: '𓂃🖊 Редактировать',
      en: '𓂃🖊 Edit',
      kk: '𓂃🖊 Өңдеу'
    },
    'dashboard.cancel': {
      ru: '✕ Отмена',
      en: '✕ Cancel',
      kk: '✕ Болдырмау'
    },
    'dashboard.changePhoto': {
      ru: 'Изменить фото',
      en: 'Change Photo',
      kk: 'Фотоны өзгерту'
    },
    'dashboard.username': {
      ru: 'Имя пользователя',
      en: 'Username',
      kk: 'Пайдаланушы аты'
    },
    'dashboard.age': {
      ru: 'Возраст',
      en: 'Age',
      kk: 'Жас'
    },
    'dashboard.city': {
      ru: 'Город',
      en: 'City',
      kk: 'Қала'
    },
    'dashboard.onSiteSince': {
      ru: 'На сайте с:',
      en: 'Member since:',
      kk: 'Сайтта:'
    },
    'dashboard.aboutMe': {
      ru: 'О себе',
      en: 'About Me',
      kk: 'Мен туралы'
    },
    'dashboard.saveChanges': {
      ru: '🗁 Сохранить изменения',
      en: '🗁 Save Changes',
      kk: '🗁 Өзгерістерді сақтау'
    },
    'dashboard.currentlyReading': {
      ru: 'Сейчас читаю',
      en: 'Currently Reading',
      kk: 'Қазір оқып жатырмын'
    },
    'dashboard.continueReading': {
      ru: '🕮 Продолжить чтение',
      en: '🕮 Continue Reading',
      kk: '🕮 Оқуды жалғастыру'
    },
    'dashboard.noCurrentBook': {
      ru: 'Вы пока не начали читать ни одной книги',
      en: 'You haven\'t started reading any books yet',
      kk: 'Сіз әлі ешқандай кітапты оқи бастаған жоқсыз'
    },
    'dashboard.findBook': {
      ru: 'Найти книгу',
      en: 'Find a Book',
      kk: 'Кітап табу'
    },
    'dashboard.favorites': {
      ru: 'Избранное',
      en: 'Favorites',
      kk: 'Таңдаулылар'
    },
    'dashboard.charts': {
      ru: 'Чарты',
      en: 'Charts',
      kk: 'Чарттар'
    },
    'dashboard.createChart': {
      ru: 'Создать чарт',
      en: 'Create Chart',
      kk: 'Чарт жасау'
    },
    'dashboard.loadChart': {
      ru: 'Загрузка чартов...',
      en: 'Loading Charts...',
      kk: 'Чарттар жүктелуде...'
    },
    'dashboard.loadsingleChart': {
      ru: 'Загрузка чарта...',
      en: 'Loading Chart...',
      kk: 'Чарт жүктелуде...'
    },
    'dashboard.chartBooks': {
      ru: 'Книги в чарте:',
      en: 'Books in Chart:',
      kk: 'Чарттағы кітаптар:'
    },
    'dashboard.status': {
      ru: 'Статус:',
      en: 'Status:',
      kk: 'Мәртебе:'
    },
    'dashboard.open': {
      ru: 'Открыть',
      en: 'Open',
      kk: 'Ашу'
    },
    'dashboard.books': {
      ru: 'книг',
      en: 'books',
      kk: 'кітаптар'
    },
    'dashboard.public': {
      ru: 'Публичный',
      en: 'Public',
      kk: 'Жалпы'
    },
    'dashboard.private': {
      ru: 'Приватный',
      en: 'Private',
      kk: 'Жеке'
    },
    'dashboard.delete': {
      ru: 'Удалить',
      en: 'Delete',
      kk: 'Жою'
    },
    'dashboard.moreInfo': {
      ru: 'Подробнее →',
      en: 'View Details →',
      kk: 'Толығырақ →'
    },
    'dashboard.noBooksInChart': {
      ru: 'В этом чарте пока нет книг',
      en: 'No books in this chart yet',
      kk: 'Бұл чартта әлі кітап жоқ'
    },
    'dashboard.addBooks': {
      ru: 'Добавить книги',
      en: 'Add Books',
      kk: 'Кітаптарды қосу'
    },
    'dashboard.chartNoFound': {
      ru: 'Чарт не найден',
      en: 'Chart not found',
      kk: 'Чарт табылмады'
    },
    'dashboard.backToProfile': {
      ru: 'Вернуться в профиль',
      en: 'Back to Profile',
      kk: 'Профильге қайту'
    },
    'dashboard.noCharts': {
      ru: 'У вас пока нет чартов',
      en: 'You have no charts yet',
      kk: 'Сізде әлі чарттар жоқ'
    },
    'dashboard.createFirstChart': {
      ru: 'Создать первый чарт',
      en: 'Create first chart',
      kk: 'Алғашқы чарт жасау'
    },
    'dashboard.noFavorites': {
      ru: 'У вас пока нет избранных книг',
      en: 'You have no favorite books yet',
      kk: 'Сізде әлі таңдаулы кітаптар жоқ'
    },
    'dashboard.findBooks': {
      ru: 'Найти книги',
      en: 'Find Books',
      kk: 'Кітаптарды табу'
    },
    'dashboard.years': {
      ru: 'лет',
      en: 'years old',
      kk: 'жас'
    },
    'dashboard.page': {
      ru: 'Страница',
      en: 'Page',
      kk: 'Бет'
    },
    'dashboard.of': {
      ru: 'из',
      en: 'of',
      kk: ''
    },

    // Search
    'search.title': {
      ru: 'Поиск книг',
      en: 'Search Books',
      kk: 'Кітаптарды іздеу'
    },
    'search.placeholder': {
      ru: 'Введите название книги или автора...',
      en: 'Enter book title or author...',
      kk: 'Кітап атауын немесе авторды енгізіңіз...'
    },
    'search.filters': {
      ru: '⋆˙⟡ Фильтры',
      en: '⋆˙⟡ Filters',
      kk: '⋆˙⟡ Сүзгілер'
    },
    'search.sort': {
      ru: 'Сортировка:',
      en: 'Sort by:',
      kk: 'Сұрыптау:'
    },
    'search.sortRating': {
      ru: 'По рейтингу',
      en: 'By Rating',
      kk: 'Рейтинг бойынша'
    },
    'search.sortTitle': {
      ru: 'По названию',
      en: 'By Title',
      kk: 'Атау бойынша'
    },
    'search.sortYear': {
      ru: 'По году',
      en: 'By Year',
      kk: 'Жыл бойынша'
    },
    'search.sortPages': {
      ru: 'По объему',
      en: 'By Pages',
      kk: 'Көлем бойынша'
    },
    'search.clearAll': {
      ru: 'Очистить все',
      en: 'Clear All',
      kk: 'Барлығын тазалау'
    },
    'search.genres': {
      ru: 'Жанры',
      en: 'Genres',
      kk: 'Жанрлар'
    },
    'search.tropes': {
      ru: 'Тропы',
      en: 'Tropes',
      kk: 'Тропалар'
    },
    'search.country': {
      ru: 'Страна',
      en: 'Country',
      kk: 'Ел'
    },
    'search.author': {
      ru: 'Автор',
      en: 'Author',
      kk: 'Автор'
    },
    'search.ageRating': {
      ru: 'Возрастной рейтинг',
      en: 'Age Rating',
      kk: 'Жас рейтингі'
    },
    'search.yearPublished': {
      ru: 'Год издания',
      en: 'Year Published',
      kk: 'Жарияланған жылы'
    },
    'search.pagesVolume': {
      ru: 'Объем (страницы)',
      en: 'Volume (pages)',
      kk: 'Көлемі (беттер)'
    },
    'search.pages': {
      ru: 'стр.',
      en: 'pages',
      kk: 'беттер'
    },
    'search.from': {
      ru: 'От',
      en: 'From',
      kk: 'Бастап'
    },
    'search.to': {
      ru: 'До',
      en: 'To',
      kk: 'Дейін'
    },
    'search.booksFound': {
      ru: 'Найдено книг:',
      en: 'Books found:',
      kk: 'Табылған кітаптар:'
    },
    'search.viewDetails': {
      ru: 'Подробнее →',
      en: 'View Details →',
      kk: 'Толығырақ →'
    },
    'search.loading': {
      ru: 'Загрузка книг...',
      en: 'Loading books...',
      kk: 'Кітаптар жүктелуде...'
    },
    'search.noBooksFound': {
      ru: 'Книги не найдены',
      en: 'No Books Found',
      kk: 'Кітаптар табылмады'
    },
    'search.tryChanging': {
      ru: 'Попробуйте изменить параметры поиска',
      en: 'Try changing search parameters',
      kk: 'Іздеу параметрлерін өзгертіп көріңіз'
    },
    'search.resetFilters': {
      ru: 'Сбросить фильтры',
      en: 'Reset Filters',
      kk: 'Сүзгілерді қалпына келтіру'
    },
    'search.previous': {
      ru: '← Назад',
      en: '← Previous',
      kk: '← Артқа'
    },
    'search.next': {
      ru: 'Вперед →',
      en: 'Next →',
      kk: 'Алға →'
    },

    // Book Details
    'book.loading': {
      ru: 'Загрузка книги...',
      en: 'Loading book...',
      kk: 'Кітап жүктелуде...'
    },
    'book.description': {
      ru: 'Описание',
      en: 'Description',
      kk: 'Сипаттама'
    },
    'book.genres': {
      ru: 'Жанры:',
      en: 'Genres:',
      kk: 'Жанрлар:'
    },
    'book.tropes': {
      ru: 'Тропы:',
      en: 'Tropes:',
      kk: 'Тропалар:'
    },
    'book.country': {
      ru: 'Страна:',
      en: 'Country:',
      kk: 'Ел:'
    },
    'book.year': {
      ru: 'Год издания:',
      en: 'Year Published:',
      kk: 'Жарияланған жылы:'
    },
    'book.pages': {
      ru: 'Страниц:',
      en: 'Pages:',
      kk: 'Беттер:'
    },
    'book.ageRating': {
      ru: 'Возрастной рейтинг:',
      en: 'Age Rating:',
      kk: 'Жас рейтингі:'
    },
    'book.startReading': {
      ru: '🕮 Начать чтение',
      en: '🕮 Start Reading',
      kk: '🕮 Оқуды бастау'
    },
    'book.addToFavorites': {
      ru: '♡ Добавить в избранное',
      en: '♡ Add to Favorites',
      kk: '♡ Таңдаулыларға қосу'
    },
    'book.inFavorites': {
      ru: '❤︎ В избранном',
      en: '❤︎ In Favorites',
      kk: '❤︎ Таңдаулыларда'
    },
    'book.addToChart': {
      ru: '+ Добавить в чарт',
      en: '+ Add to Chart',
      kk: '+ Чартқа қосу'
    },
    'book.selectChart': {
      ru: 'Выберите чарт:',
      en: 'Select Chart:',
      kk: 'Чартты таңдаңыз:'
    },
    'book.noCharts': {
      ru: 'У вас пока нет чартов',
      en: 'You have no charts yet',
      kk: 'Сізде әлі чарттар жоқ'
    },
    'book.createNewChart': {
      ru: '+ Создать новый чарт',
      en: '+ Create New Chart',
      kk: '+ Жаңа чарт жасау'
    },
    'book.reviewsComments': {
      ru: 'Отзывы и комментарии',
      en: 'Reviews and Comments',
      kk: 'Пікірлер мен түсініктемелер'
    },
    'book.leaveReview': {
      ru: 'Оставьте свой отзыв',
      en: 'Leave Your Review',
      kk: 'Пікіріңізді қалдырыңыз'
    },
    'book.yourRating': {
      ru: 'Ваша оценка:',
      en: 'Your Rating:',
      kk: 'Сіздің бағаңыз:'
    },
    'book.writeReview': {
      ru: 'Напишите ваш отзыв...',
      en: 'Write your review...',
      kk: 'Пікіріңізді жазыңыз...'
    },
    'book.submitReview': {
      ru: '✎ᝰ.ᐟ⋆⑅˚₊ Отправить отзыв',
      en: '✎ᝰ.ᐟ⋆⑅˚₊ Submit Review',
      kk: '✎ᝰ.ᐟ⋆⑅˚₊ Пікір жіберу'
    },
    'book.sending': {
      ru: 'Отправка...',
      en: 'Sending...',
      kk: 'Жіберілуде...'
    },
    'book.noReviews': {
      ru: 'Пока нет отзывов. Будьте первым!',
      en: 'No reviews yet. Be the first!',
      kk: 'Әлі пікірлер жоқ. Бірінші болыңыз!'
    },
    'book.notFound': {
      ru: 'Книга не найдена',
      en: 'Book Not Found',
      kk: 'Кітап табылмады'
    },
    'book.backToSearch': {
      ru: 'Вернуться к поиску',
      en: 'Back to Search',
      kk: 'Іздеуге оралу'
    },

    // Chart Creator
    'chart.createNew': {
      ru: '+ Создать чарт',
      en: '+ Create Chart',
      kk: '+ Чарт жасау'
    },
    'chart.myCharts': {
      ru: '🗁 Мои чарты',
      en: '🗁 My Charts',
      kk: '🗁 Менің чарттарым'
    },
    'chart.createNewTitle': {
      ru: 'Создать новый чарт',
      en: 'Create New Chart',
      kk: 'Жаңа чарт жасау'
    },
    'chart.editTitle': {
      ru: 'Редактировать чарт',
      en: 'Edit Chart',
      kk: 'Чартты өңдеу'
    },
    'chart.description': {
      ru: 'Создайте свой личный чарт книг — соберите любимые произведения в одну коллекцию',
      en: 'Create your personal book chart — collect your favorite works in one collection',
      kk: 'Кітаптардың жеке чартын жасаңыз — сүйікті шығармаларыңызды бір жинаққа жинаңыз'
    },
    'chart.coverLabel': {
      ru: 'Обложка чарта',
      en: 'Chart Cover',
      kk: 'Чарт мұқабасы'
    },
    'chart.uploadCover': {
      ru: 'Загрузите обложку',
      en: 'Upload Cover',
      kk: 'Мұқабаны жүктеу'
    },
    'chart.selectImage': {
      ru: 'Выбрать изображение',
      en: 'Select Image',
      kk: 'Кескінді таңдау'
    },
    'chart.titleLabel': {
      ru: 'Название чарта *',
      en: 'Chart Title *',
      kk: 'Чарт атауы *'
    },
    'chart.titlePlaceholder': {
      ru: 'Например: Любимая фантастика',
      en: 'For example: Favorite Sci-Fi',
      kk: 'Мысалы: Сүйікті фантастика'
    },
    'chart.descriptionLabel': {
      ru: 'Описание',
      en: 'Description',
      kk: 'Сипаттама'
    },
    'chart.descriptionPlaceholder': {
      ru: 'Расскажите о вашей подборке...',
      en: 'Tell about your collection...',
      kk: 'Жинағыңыз туралы айтыңыз...'
    },
    'chart.makePublic': {
      ru: 'Сделать чарт публичным (другие пользователи смогут его увидеть)',
      en: 'Make chart public (other users will be able to see it)',
      kk: 'Чартты ашық ету (басқа пайдаланушылар көре алады)'
    },
    'chart.booksInChart': {
      ru: 'Книги в чарте',
      en: 'Books in Chart',
      kk: 'Чарттағы кітаптар'
    },
    'chart.addBook': {
      ru: '+ Добавить книгу',
      en: '+ Add Book',
      kk: '+ Кітап қосу'
    },
    'chart.searchBook': {
      ru: 'Поиск книги...',
      en: 'Search book...',
      kk: 'Кітапты іздеу...'
    },
    'chart.searching': {
      ru: 'Поиск...',
      en: 'Searching...',
      kk: 'Іздеу...'
    },
    'chart.addBooksToChart': {
      ru: 'Добавьте книги в ваш чарт',
      en: 'Add books to your chart',
      kk: 'Чартыңызға кітаптар қосыңыз'
    },
    'chart.save': {
      ru: '𓂃✍︎ Создать чарт',
      en: '𓂃✍︎ Create Chart',
      kk: '𓂃✍︎ Чарт жасау'
    },
    'chart.saveChanges': {
      ru: '🗁 Сохранить изменения',
      en: '🗁 Save Changes',
      kk: '🗁 Өзгерістерді сақтау'
    },
    'chart.saving': {
      ru: 'Сохранение...',
      en: 'Saving...',
      kk: 'Сақталуда...'
    },
    'chart.reset': {
      ru: 'Сбросить',
      en: 'Reset',
      kk: 'Қалпына келтіру'
    },
    'chart.manageTitle': {
      ru: 'Мои чарты',
      en: 'My Charts',
      kk: 'Менің чарттарым'
    },
    'chart.manageDescription': {
      ru: 'Управляйте своими коллекциями книг',
      en: 'Manage your book collections',
      kk: 'Кітап жинақтарыңызды басқарыңыз'
    },
    'chart.public': {
      ru: 'Публичный',
      en: 'Public',
      kk: 'Ашық'
    },
    'chart.noCharts': {
      ru: 'У вас пока нет чартов',
      en: 'You have no charts yet',
      kk: 'Сізде әлі чарттар жоқ'
    },
    'chart.createFirst': {
      ru: 'Создайте свою первую коллекцию книг',
      en: 'Create your first book collection',
      kk: 'Бірінші кітап жинағыңызды жасаңыз'
    },
    'chart.books': {
      ru: 'книг',
      en: 'books',
      kk: 'кітап'
    }
  };

  constructor() {
    // Загрузка сохраненного языка из localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage && ['ru', 'en', 'kk'].includes(savedLanguage)) {
      this.currentLanguageSubject.next(savedLanguage);
    }
  }

  get currentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('preferredLanguage', lang);
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[this.currentLanguage] || key;
  }

  // Для использования в шаблонах с параметрами
  instant(key: string): string {
    return this.translate(key);
  }
}