'use strict';



const assert = require('assert');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const By = webdriver.By;

let browser;

const options = new firefox.Options();

options.addArguments('-headless');

// Test suite
test.describe("Trading page", () => {
    test.beforeEach((done) => {
        browser = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.firefox())
            .setFirefoxOptions(options)
            .build();
        browser.get('https://trading.joln17.me');
        done();
    });

    test.afterEach((done) => {
        browser.quit();
        done();
    });

    function goToNavLink(target) {
        browser.findElement(By.linkText(target)).then((element) => {
            element.click();
        });
    }

    function matchUrl(target) {
        browser.getCurrentUrl().then((url) => {
            assert.ok(url.endsWith(target));
        });
    }

    function assertH1(target) {
        browser.findElement(By.css("h1")).then((element) => {
            element.getText().then((text) => {
                assert.equal(text, target);
            });
        });
    }

    function login() {
        goToNavLink("Logga in");
        let currentUrl;

        browser.getCurrentUrl().then((url) => {
            currentUrl = url;
        });
        browser.findElement(By.name('emailInput')).then((element) => {
            element.sendKeys("test@test.com");
        });
        browser.findElement(By.name('passwordInput')).then((element) => {
            element.sendKeys("password12345");
        });
        browser.findElement(By.className('form-button')).then((element) => {
            element.click();
        });
        browser.wait(() => {
            return browser.getCurrentUrl().then((url) => {
                return url !== currentUrl;
            });
        });
    }

    function logout() {
        goToNavLink("Logga ut");
        let currentUrl;

        browser.wait(() => {
            return browser.getCurrentUrl().then((url) => {
                return url !== currentUrl;
            });
        });
    }



    test.it("Test index page", (done) => {
        browser.getTitle().then((title) => {
            assert.equal(title, "Kryptohandel");
        });

        assertH1("Aktuella kurser");
        matchUrl('/');

        done();
    });



    test.it("Test go to Bitcoin asset page", (done) => {
        goToNavLink("Bitcoin");
        browser.findElement(By.css("h1")).then((element) => {
            element.getText().then((text) => {
                assert.equal(text.substring(0, 7), "bitcoin");
            });
        });
        matchUrl('/asset/bitcoin');

        done();
    });



    test.it("Test go to Login", (done) => {
        goToNavLink("Logga in");
        assertH1("Logga in");
        matchUrl('login');

        done();
    });



    test.it("Test login", (done) => {
        login();
        matchUrl('holdings');

        done();
    });



    test.it("Test logout", (done) => {
        login();
        logout();
        matchUrl('login');

        done();
    });
});
