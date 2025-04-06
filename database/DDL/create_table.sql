DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS game_team;
DROP TABLE IF EXISTS elo_rating;


CREATE TABLE team (
    team_id             INT NOT NULL,
    team_name           VARCHAR (100) NOT NULL,
    team_home_venue     VARCHAR (100)
);

ALTER TABLE team
    ADD (
        CONSTRAINT team_pk PRIMARY KEY (team_id)
    );
ALTER TABLE team
    MODIFY COLUMN team_id INT NOT NULL AUTO_INCREMENT;
CREATE TABLE game (
    game_id         INT NOT NULL,
    year            INT NOT NULL,
    round_no        VARCHAR (3) NOT NULL,
    venue           VARCHAR (100),
    team1_id        INT NOT NULL,
    team2_id        INT NOT NULL
);

ALTER TABLE game
ADD(
    CONSTRAINT game_pk PRIMARY KEY (game_id),
    CONSTRAINT team1_id_fk FOREIGN KEY (team1_id) REFERENCES team(team_id),
    CONSTRAINT team2_id_fk FOREIGN KEY (team2_id) REFERENCES team(team_id)
);

ALTER TABLE game
    MODIFY COLUMN game_id INT NOT NULL AUTO_INCREMENT;

CREATE TABLE game_team (
    game_team_id            INT NOT NULL,
    game_id                 INT NOT NULL,
    team_id                 INT NOT NULL,
    is_home_team            TINYINT,
    is_winner               TINYINT NOT NULL,
    score                   INT,
    goals                   INT NOT NULL,
    behinds                 INT,
    disposals               INT,
    kicks                   INT,
    marks                   INT,
    handballs               INT,
    hit_outs                INT,
    tackles                 INT,
    rebound_50s             INT,
    inside_50s              INT,
    clearances              INT,
    clangers                INT,
    freekicks_for           INT,
    freekicks_against       INT,
    brownlow_votes          INT,
    contested_possessions   INT,
    uncontested_possessions INT,
    marks_inside_50s        INT,
    one_percenters          INT,
    bounces                 INT,
    goal_assist             INT
);

ALTER TABLE game_team
    ADD(
        CONSTRAINT game_team_pk PRIMARY KEY (game_team_id),
        CONSTRAINT game_team_game_fk FOREIGN KEY (game_id) REFERENCES game(game_id),
        CONSTRAINT game_team_team_fk FOREIGN KEY (team_id) REFERENCES team(team_id)
    );
ALTER TABLE game_team
    MODIFY COLUMN game_team_id INT NOT NULL AUTO_INCREMENT; 

CREATE TABLE elo_rating (
    elo_rating_id       INT NOT NULL,
    team_id             INT NOT NULL,
    game_id             INT NOT NULL,
    elo_rating_before   INT NOT NULL,
    elo_rating_after    INT NOT NULL,
    k_value             INT NOT NULL
);

ALTER TABLE elo_rating
    ADD(
        CONSTRAINT elo_rating_pk PRIMARY KEY (elo_rating_id),
        CONSTRAINT elo_rating_team_fk FOREIGN KEY (team_id) REFERENCES team(team_id),
        CONSTRAINT elo_rating_game_fk FOREIGN KEY (game_id) REFERENCES game(game_id)
    );
    
ALTER TABLE elo_rating 
	MODIFY COLUMN elo_rating_id INT NOT NULL AUTO_INCREMENT;