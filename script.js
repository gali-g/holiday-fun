//Uses 2 APIs: Fun Holidays! from https://national-api-day.herokuapp.com/ and Giphy

const app = {};
const birthday = {};

app.key = 'Du7VNaOEr6Ui8mbyQHoUbrIvZxbsz8go';

birthday.holiday;

app.holidaySelector = function (holidaysArray) {
    const randomIndex = Math.floor(Math.random() * holidaysArray.length);
    return holidaysArray[randomIndex];
};

app.keywordCleaner = function (searchKeywords) {
    const cleanedKeywords = searchKeywords.replace(/Day|National|International|Global/gi, '');
    return cleanedKeywords;
};

app.getHolidays = function (month, day) {
    $.ajax({
        url: 'https://national-api-day.herokuapp.com/api/date/' + month + '/' + day,
        method: 'GET',
        dataType: 'json',
    }).then((res) => {
        let singleHoliday = app.holidaySelector(res.holidays);
        birthday.holiday = singleHoliday;
        let holidayKeyword = app.keywordCleaner(singleHoliday);
        app.getImages(holidayKeyword);
    });
};

app.getImages = function (query) {
    $.ajax({
        url: 'https://api.giphy.com/v1/gifs/search',
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.key,
            q: query
        },
        success: function (res) {
            $('.result').empty();
            if (res.data.length === 0) {
                app.displayErrorImage();
            } else {
                app.displayImage(res.data[0]);
                console.log(res.data[0]);
            };
        },
        error: function (xhr, status, error) {
            $('.result').empty();
            app.displayErrorImage();
        }
    });
};

app.displayImage = function (gifsArray) {
    const markup = `
            <div class="img-box">
            <h3>Let's celebrate this instead:</h3>
            <h2><b>${birthday.holiday}</b>!</h2>
            <img src="${gifsArray.images.original.url}" alt="${gifsArray.title}" />
            </div>
        `;
    $('.result').append(markup);
    $('.result').show();
};

app.displayErrorImage = function () {
    const markup = `
        <div class="img-box">
        <h3>Let's celebrate this instead:</h3>
        <h2><b>${birthday.holiday}</b>!</h2>
        <img src="https://media.giphy.com/media/IwAZ6dvvvaTtdI8SD5/giphy.gif" alt="Excited Season 2 GIF By The Office" />
        </div>
    `;
    $('.result').append(markup);
    $('.result').show();
};

app.getBirthday = function () {
    let birthdayMonth = $('#dob-month').val();
    let birthdayDay = $('#dob-day').val();
    app.getHolidays(birthdayMonth, birthdayDay);
}

app.init = function () {
    $('form').on('submit', function (event) {
        event.preventDefault();
        app.getBirthday();
    });
};

$(function () {
    app.init();
});