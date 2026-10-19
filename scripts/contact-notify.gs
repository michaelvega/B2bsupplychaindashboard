/**
 * Contact Us Now: emails both founders when someone submits the form.
 * Deploy: Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * Then give the /exec URL to the site as the CONTACT_WEBAPP_URL secret.
 */
const TO = 'michael@procept.tech,sam@procept.tech';

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    MailApp.sendEmail({
      to: TO,
      replyTo: d.email,
      name: 'Procept Contact Form',
      subject: 'Contact Us Now: ' + d.name,
      body:
        d.name + ' <' + d.email + '> wrote:\n\n' +
        (d.message || '(no message)') +
        '\n\nSent from: ' + (d.source || 'procept.tech') +
        '\nReply to this email to answer them directly.',
    });
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
