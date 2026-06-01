export default interface Ticket {
    // Internal stable key used for v-for / delete. Always a UUID.
    id: string;
    // Human-facing reference (e.g. "T-AB12" or a Jira key). Auto-generated when
    // the user doesn't supply one.
    ticketId: string;
    title: string,
    link: string,
    description: string,
    score: string,
    average: string,
    closest: string,
    votingOn: boolean,
    voted: boolean
}
