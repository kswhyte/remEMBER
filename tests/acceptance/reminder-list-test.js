import { test } from 'qunit';
import moduleForAcceptance from 'remember/tests/helpers/module-for-acceptance';

import Ember from 'ember';

moduleForAcceptance('Acceptance | reminders list');

test('viewing the homepage re-routes to /reminders, rendering 5 reminders', function(assert) {
  server.createList('reminder', 5);

  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/reminders');
    assert.equal(Ember.$('.spec-reminder-item').length, 5);
  });
});

test('clicking on an individual reminder title appends it to the bottom of the page with more details', function(assert) {
  server.createList('reminder', 5);

  visit('/');
  click('.spec-reminder-title');

  andThen(function() {
    assert.equal(currentURL(), '/reminders/1');
    assert.equal(Ember.$('.spec-reminder-title:first').text().trim(), Ember.$('.detailed-reminder-title').text().trim());
  });
});

test('welcome page should render if there are no reminders in the database', function(assert) {

  visit('/');

  andThen(function() {
    assert.equal(Ember.$('.welcome-page-headline').length, 1, 'welcome page headline exists');
    assert.equal(Ember.$('.welcome-page-headline').text(), 'Welcome to Reminders!', 'welcome page headline displays correctly');
  });
});

test('clicking "Add a New Reminder" will render a form on the page to add new reminders', function(assert) {
  visit('/reminders/');
  click('.add-reminder-button')

  andThen(function() {
    assert.equal(currentURL(), '/reminders/new');
    assert.equal(find('.edit-reminder-form').length, 1);
    assert.equal(find('.edit-reminder-title').length, 1);
    assert.equal(find('.edit-reminder-date').length, 1);
    assert.equal(find('.edit-reminder-notes').length, 1);
  });
});

test('clicking on the edit button for a reminder will display the submit button for that input field, proving the existence of the input area', function(assert) {
  server.createList('reminder', 5);

  visit('/');
  click('.spec-reminder-title');
  click('.edit-reminder-button');

  andThen(function () {
    assert.equal(Ember.$('.submit-edits-button').length, 1, 'the submit edits button exists');
  })
});

test('it properly edits reminders when user enters in new information', function (assert) {
  visit('/');
  click('.add-reminder-button');
  fillIn('.edit-reminder-title', 'Buy milk');
  click('.submit-edits-button');
  click('.spec-reminder-title');

  andThen(function () {
    assert.equal(find('.spec-reminder-title:last').text().trim(), 'Buy milk', 'original title shows up');
  });

  click('.edit-reminder-button');
  fillIn('.edit-reminder-title', 'Sell my car');
  click('.submit-edits-button');

  andThen(function () {
    assert.equal(find('.spec-reminder-title:last').text().trim(), 'Sell my car', 'user successfully edits the title of an existing reminder');
  });
});

test('it reverts unsaved changes while editing reminders', function (assert) {
  visit('/');
  click('.add-reminder-button');
  fillIn('.edit-reminder-title', 'Pick up kids from school');
  click('.submit-edits-button');
  click('.spec-reminder-title');

  andThen(function () {
    assert.equal(find('.spec-reminder-title:last').text().trim(), 'Pick up kids from school', 'original title shows up');
  });

  click('.edit-reminder-button');
  fillIn('.edit-reminder-title', 'Pick up kids from daycare');

  andThen(function () {
    assert.equal(find('.spec-reminder-title:last').text().trim(), 'Pick up kids from daycare', 'user successfully edits the title of an existing reminder');
  });

  click('.revert-changes-button');

  andThen(function () {
    assert.equal(find('.spec-reminder-title:last').text().trim(), 'Pick up kids from school', 'user successfully edits the title of an existing reminder');
  });

  click('.submit-edits-button');

  andThen(function () {
    assert.equal(find('.spec-reminder-title:last').text().trim(), 'Pick up kids from school', 'user successfully edits the title of an existing reminder');
  });
});
