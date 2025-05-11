import pandas as pd
from sqlalchemy.orm import aliased
from backend.db_access.db_base import get_db_session
from backend.db_access.schema import Match, Team, EloRatings, MatchStats

session = get_db_session()

ms1 = aliased(MatchStats)
ms2 = aliased(MatchStats)
r1 = aliased(EloRatings)
r2 = aliased(EloRatings)
t1 = aliased(Team)
t2 = aliased(Team)

session = get_db_session()
with session as session:
    query = (
        session.query(
            Match.id.label("match_id"),
            Match.date,
            Match.venue,

            Match.team1_id,
            t1.name.label("team1_name"),
            r1.rating_before.label("team1_rating_before"),
            (Match.venue == t1.home_venue).label("team1_home"),
            ms1.total_goals.label("team1_goals"),
            ms1.total_behinds.label("team1_behinds"),
            ms1.total_score.label("team1_score"),

            Match.team2_id,
            t2.name.label("team2_name"),
            r2.rating_before.label("team2_rating_before"),
            (Match.venue == t2.home_venue).label("team2_home"),
            ms2.total_goals.label("team2_goals"),
            ms2.total_behinds.label("team2_behinds"),
            ms2.total_score.label("team2_score"),

            Match.winner
        )
        .join(ms1, (Match.id == ms1.match_id) & (Match.team1_id == ms1.team_id))
        .join(r1, (Match.id == r1.match_id) & (Match.team1_id == r1.team_id))
        .join(t1, Match.team1_id == t1.id)
        .join(ms2, (Match.id == ms2.match_id) & (Match.team2_id == ms2.team_id))
        .join(r2, (Match.id == r2.match_id) & (Match.team2_id == r2.team_id))
        .join(t2, Match.team2_id == t2.id)
    )
    
result = query.all()
df = pd.DataFrame(result, columns=[col['name'] for col in query.column_descriptions])
# Convert the DataFrame to a CSV file
df.to_csv("match_data.csv", index=False)
print("Data saved to match_data.csv")
# print(df.head())