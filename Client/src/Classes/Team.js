class Team {
    constructor(teamCode, teamName, teamProfile, teamDescription, teamLeader, teamMemberList, projectLength, taskList) {
        this._teamCode = teamCode;
        this._teamName = teamName;
        this._teamProfile = teamProfile;
        this._teamDescription = teamDescription;
        this._teamLeader = teamLeader;
        this._teamMemberList = teamMemberList;
        this._projectLength = projectLength;
        this._taskList = taskList;
    }

    // Getter methods
    get teamCode() {
        return this._teamCode;
    }

    get teamName() {
        return this._teamName;
    }

    get teamProfile() {
        return this._teamProfile;
    }

    get teamDescription() {
        return this._teamDescription;
    }

    get teamLeader() {
        return this._teamLeader;
    }

    get teamMemberList() {
        return this._teamMemberList;
    }

    get projectLength() {
        return this._projectLength;
    }

    get taskList() {
        return this._taskList;
    }

    // Setter methods
    set teamCode(value) {
        this._teamCode = value;
    }

    set teamName(value) {
        this._teamName = value;
    }

    set teamProfile(value) {
        this._teamProfile = value;
    }

    set teamDescription(value) {
        this._teamDescription = value;
    }

    set teamMemberList(value) {
        this._teamMemberList = value;
    }

    set projectLength(value) {
        this._projectLength = value;
    }

    set taskList(value) {
        this._taskList = value;
    }
}

export default Team;
