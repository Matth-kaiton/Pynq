import * as Calendar from 'expo-calendar';

/* list and user to find need to */
var calendarList: string[] = [];
const user = "quentinreinette@gmail.com"




/* fonction qui permet de récupéré les event du calendrier cibler */
export async function getEvent() {

    try {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        for (const calendar of calendars) {

            /* vérification pour ajouter seulement le calandrier lier au mail de l'utilisateur mail qui nous intérèsse */
            if (calendar.ownerAccount == user) {
                calendarList.push(calendar.id)
            }
        }
    } catch (err) {
        console.error('Get calendar fail', err);
    }



    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const event = await Calendar.getEventsAsync(calendarList, startDate, endDate)
    console.log(`Here the event since ${startDate} to ${endDate}`)
    console.log(event);
}



