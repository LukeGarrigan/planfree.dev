export default interface Player {
    id: string;
    userId?: string;
    name: string;
    // Only present once the room has revealed; before that the server sends
    // `hasVoted` instead so votes can't be read off the wire early.
    vote?: string;
    hasVoted?: boolean;
    spectator?: boolean;
}