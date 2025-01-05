import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'sportradar-soccer/unknown (api/6.1.2)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Provides historical season information for a given competition. Valid competition IDs
   * can be found in the Competitions feed.
   *
   * @summary Competition Seasons
   */
  soccerCompetitionSeasons(metadata: types.SoccerCompetitionSeasonsMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitionSeasonsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitions/{competition_id}/seasons.{format}', 'get', metadata);
  }

  /**
   * Provides the name, id, and parent id for a given competition.
   *
   * @summary Competition Info
   */
  soccerCompetitionInfo(metadata: types.SoccerCompetitionInfoMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitionInfoResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitions/{competition_id}/info.{format}', 'get', metadata);
  }

  /**
   * Provides a list of all available Soccer competitions.
   *
   * @summary Competitions
   */
  soccerCompetitions(metadata: types.SoccerCompetitionsMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitionsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitions.{format}', 'get', metadata);
  }

  /**
   * Provides competitor id mapping between previous versions of the Soccer API.
   *
   * @summary Competitor Mappings
   */
  soccerCompetitorMappings(metadata: types.SoccerCompetitorMappingsMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitorMappingsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitors/mappings.{format}', 'get', metadata);
  }

  /**
   * Provides the valid Sportradar Id in cases when two competitors have been merged into
   * one.<br><br>Entries are retained in this endpoint for one week.
   *
   * @summary Competitor Merge Mappings
   */
  soccerCompetitorMergeMappings(metadata: types.SoccerCompetitorMergeMappingsMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitorMergeMappingsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitors/merge_mappings.{format}', 'get', metadata);
  }

  /**
   * Provides top-level information for a given team, including the full team roster,
   * manager, home venue, and team colors.
   *
   * @summary Competitor Profile
   */
  soccerCompetitorProfile(metadata: types.SoccerCompetitorProfileMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitorProfileResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitors/{competitor_id}/profile.{format}', 'get', metadata);
  }

  /**
   * Provides previous and upcoming match information for a given competitor, including
   * statistics for past matches and scheduling info for upcoming matches.
   *
   * @summary Competitor Summaries
   */
  soccerCompetitorSummaries(metadata: types.SoccerCompetitorSummariesMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitorSummariesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitors/{competitor_id}/summaries.{format}', 'get', metadata);
  }

  /**
   * Provides previous and upcoming matches between two teams including scoring information,
   * player and team match statistics.
   *
   * @summary Competitor vs Competitor
   */
  soccerCompetitorVsCompetitor(metadata: types.SoccerCompetitorVsCompetitorMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitorVsCompetitorResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitors/{competitor_id}/versus/{competitor2_id}/summaries.{format}', 'get', metadata);
  }

  /**
   * Provides match information for a given day including team scoring, player and team match
   * statistics.
   *
   * @summary Daily Summaries
   */
  soccerDailySummaries(metadata: types.SoccerDailySummariesMetadataParam): Promise<FetchResponse<200, types.SoccerDailySummariesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/schedules/{date}/summaries.{format}', 'get', metadata);
  }

  /**
   * Provides an alternate set of statistics for an event which match official league
   * sites.<br><br>Official stats are provided for: England Premier League, Germany
   * Bundesliga, Italy Serie A, Spain La Liga, UEFA Champions League, USA MLS, Austria
   * Bundesliga.
   *
   * @summary League Timeline
   */
  soccerLeagueTimeline(metadata: types.SoccerLeagueTimelineMetadataParam): Promise<FetchResponse<200, types.SoccerLeagueTimelineResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/{sport_event_id}/league_timeline.{format}', 'get', metadata);
  }

  /**
   * Provides a play-by-play event timeline for currently live matches. Matches appear a few
   * minutes before kick-off and disappear a few minutes after the match reaches “ended”
   * status.
   *
   * @summary Live Timelines
   */
  soccerLiveTimelines(metadata: types.SoccerLiveTimelinesMetadataParam): Promise<FetchResponse<200, types.SoccerLiveTimelinesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/schedules/live/timelines.{format}', 'get', metadata);
  }

  /**
   * Provides match information for all currently live matches including team scoring, player
   * and team match statistics. This feed updates in real time as matches are played. Matches
   * appear a few minutes before kick-off and disappear a few minutes after the match reaches
   * “ended” status.
   *
   * @summary Live Summaries
   */
  soccerLiveSummaries(metadata: types.SoccerLiveSummariesMetadataParam): Promise<FetchResponse<200, types.SoccerLiveSummariesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/schedules/live/summaries.{format}', 'get', metadata);
  }

  /**
   * Provides player id mapping between previous versions of the Soccer API.
   *
   * @summary Player Mappings
   */
  soccerPlayerMappings(metadata: types.SoccerPlayerMappingsMetadataParam): Promise<FetchResponse<200, types.SoccerPlayerMappingsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/players/mappings.{format}', 'get', metadata);
  }

  /**
   * Provides match info and statistics for the past 10 matches in which a given player
   * participated.
   *
   * @summary Player Summaries
   */
  soccerPlayerSummaries(metadata: types.SoccerPlayerSummariesMetadataParam): Promise<FetchResponse<200, types.SoccerPlayerSummariesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/players/{player_id}/summaries.{format}', 'get', metadata);
  }

  /**
   * Provides valid ids for players who have had their profiles merged. While Sportradar
   * always strives to provide one unique player id, it is a possibility for two ids to be
   * created. This feed provides the correct id once profiles have been
   * merged.<br><br>Entries are retained in this endpoint for one week.
   *
   * @summary Player Merge Mappings
   */
  soccerPlayerMergeMappings(metadata: types.SoccerPlayerMergeMappingsMetadataParam): Promise<FetchResponse<200, types.SoccerPlayerMergeMappingsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/players/merge_mappings.{format}', 'get', metadata);
  }

  /**
   * Provides detailed information for a given season, including participating teams and
   * coverage level.
   *
   * @summary Season Info
   */
  soccerSeasonInfo(metadata: types.SoccerSeasonInfoMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonInfoResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/info.{format}', 'get', metadata);
  }

  /**
   * Provides player information, including current and historical team membership info.
   *
   * @summary Player Profile
   */
  soccerPlayerProfile(metadata: types.SoccerPlayerProfileMetadataParam): Promise<FetchResponse<200, types.SoccerPlayerProfileResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/players/{player_id}/profile.{format}', 'get', metadata);
  }

  /**
   * Provides a 10 second live delta of match information, including scoring and a
   * play-by-play event timeline.
   *
   * @summary Live Timelines Delta
   */
  soccerLiveTimelinesDelta(metadata: types.SoccerLiveTimelinesDeltaMetadataParam): Promise<FetchResponse<200, types.SoccerLiveTimelinesDeltaResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/schedules/live/timelines_delta.{format}', 'get', metadata);
  }

  /**
   * Provides a list of leaders for a given season. Statistics include points, goals,
   * assists, cards, and minutes played.
   *
   * @summary Season Leaders
   */
  soccerSeasonLeaders(metadata: types.SoccerSeasonLeadersMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonLeadersResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/leaders.{format}', 'get', metadata);
  }

  /**
   * Provides information about linked cup rounds for a given season.<br><br>Use this feed to
   * compile full advancement brackets for relevant seasons/tournaments. Links between all
   * matches and rounds are available when competitors (TBD vs. TBD) are not yet known.
   *
   * @summary Season Links
   */
  soccerSeasonLinks(metadata: types.SoccerSeasonLinksMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonLinksResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/stages_groups_cup_rounds.{format}', 'get', metadata);
  }

  /**
   * Provides the over/under match goal totals for all teams in a given season.
   *
   * @summary Season Over/Under Statistics
   */
  soccerSeasonOverunderStatistics(metadata: types.SoccerSeasonOverunderStatisticsMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonOverunderStatisticsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/over_under_statistics.{format}', 'get', metadata);
  }

  /**
   * Provides a list of teams participating for a given season.
   *
   * @summary Season Competitors
   */
  soccerSeasonCompetitors(metadata: types.SoccerSeasonCompetitorsMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonCompetitorsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/competitors.{format}', 'get', metadata);
  }

  /**
   * Provides match lineups and substitutions for a given season.
   *
   * @summary Season Lineups
   */
  soccerSeasonLineups(metadata: types.SoccerSeasonLineupsMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonLineupsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/lineups.{format}', 'get', metadata);
  }

  /**
   * Provides a list of injured and/or missing players for a given season.
   *
   * @summary Season Missing Players
   */
  soccerSeasonMissingPlayers(metadata: types.SoccerSeasonMissingPlayersMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonMissingPlayersResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/missing_players.{format}', 'get', metadata);
  }

  /**
   * Provides names and ids for all participating players for a given season.
   *
   * @summary Season Players
   */
  soccerSeasonPlayers(metadata: types.SoccerSeasonPlayersMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonPlayersResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/players.{format}', 'get', metadata);
  }

  /**
   * Provides detailed standings info for a given season.
   *
   * @summary Season Standings
   */
  soccerSeasonStandings(metadata: types.SoccerSeasonStandingsMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonStandingsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/standings.{format}', 'get', metadata);
  }

  /**
   * Provides 3-way win probabilities (home team win, away team win, draw) for all matches
   * for a given season.
   *
   * @summary Season Probabilities
   */
  soccerSeasonProbabilities(metadata: types.SoccerSeasonProbabilitiesMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonProbabilitiesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/probabilities.{format}', 'get', metadata);
  }

  /**
   * Provides basic match information for all matches for a given season, including scoring
   * and match coverage.
   *
   * @summary Season Schedule
   */
  soccerSeasonSchedule(metadata: types.SoccerSeasonScheduleMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonScheduleResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/schedules.{format}', 'get', metadata);
  }

  /**
   * Provides a list of all player transfers for a given season.
   *
   * @summary Season Transfers
   */
  soccerSeasonTransfers(metadata: types.SoccerSeasonTransfersMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonTransfersResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/transfers.{format}', 'get', metadata);
  }

  /**
   * Provides information for all matches from a given season including scoring and
   * statistics at the match level.
   *
   * @summary Season Summaries
   */
  soccerSeasonSummaries(metadata: types.SoccerSeasonSummariesMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonSummariesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/summaries.{format}', 'get', metadata);
  }

  /**
   * Provides a list of historical season information for all competitions. Competitions will
   * return a maximum of three seasons of data, including current or newly created seasons.
   *
   * @summary Seasons
   */
  soccerSeasons(metadata: types.SoccerSeasonsMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons.{format}', 'get', metadata);
  }

  /**
   * Provides team and player seasonal statistics for a given season.
   *
   * @summary Seasonal Competitor Statistics
   */
  soccerSeasonalCompetitorStatistics(metadata: types.SoccerSeasonalCompetitorStatisticsMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonalCompetitorStatisticsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/competitors/{competitor_id}/statistics.{format}', 'get', metadata);
  }

  /**
   * Provides detailed roster information for a given match. Starting players, substitutions,
   * formation type, and channel availability are included if supported by coverage level.
   *
   * @summary Sport Event Lineups
   */
  soccerSportEventLineups(metadata: types.SoccerSportEventLineupsMetadataParam): Promise<FetchResponse<200, types.SoccerSportEventLineupsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/{sport_event_id}/lineups.{format}', 'get', metadata);
  }

  /**
   * Provides noteworthy, human-readable, facts based on statistical information about a
   * given match and its competing teams.
   *
   * @summary Sport Event Fun Facts
   */
  soccerSportEventFunFacts(metadata: types.SoccerSportEventFunFactsMetadataParam): Promise<FetchResponse<200, types.SoccerSportEventFunFactsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/{sport_event_id}/fun_facts.{format}', 'get', metadata);
  }

  /**
   * Provides player roster information for every team from a given season.
   *
   * @summary Seasonal Competitor Players
   */
  soccerSeasonalCompetitorPlayers(metadata: types.SoccerSeasonalCompetitorPlayersMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonalCompetitorPlayersResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/competitor_players.{format}', 'get', metadata);
  }

  /**
   * Provides ids for sport events that have been created in the last 24 hours.
   *
   * @summary Sport Events Created
   */
  soccerSportEventsCreated(metadata: types.SoccerSportEventsCreatedMetadataParam): Promise<FetchResponse<200, types.SoccerSportEventsCreatedResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/created.{format}', 'get', metadata);
  }

  /**
   * Provides real-time match-level statistics and a play-by-play event timeline for a given
   * match. This includes player and team stats, scoring info, channel availability, x/y
   * event coordinates, and human-readable event descriptions. Please note that data returned
   * is determined by coverage level.
   *
   * @summary Sport Event Timeline
   */
  soccerSportEventTimeline(metadata: types.SoccerSportEventTimelineMetadataParam): Promise<FetchResponse<200, types.SoccerSportEventTimelineResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/{sport_event_id}/timeline.{format}', 'get', metadata);
  }

  /**
   * Provides ids for sport events that have been removed from the API due to an entry error.
   * Ids will remain in the response for 2 weeks.
   *
   * @summary Sport Events Removed
   */
  soccerSportEventsRemoved(metadata: types.SoccerSportEventsRemovedMetadataParam): Promise<FetchResponse<200, types.SoccerSportEventsRemovedResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/removed.{format}', 'get', metadata);
  }

  /**
   * Provides real-time match-level statistics for a given match. Including player and team
   * stats, scoring info, and channel availability. Please note that data returned is
   * determined by coverage level.
   *
   * @summary Sport Event Summary
   */
  soccerSportEventSummary(metadata: types.SoccerSportEventSummaryMetadataParam): Promise<FetchResponse<200, types.SoccerSportEventSummaryResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/{sport_event_id}/summary.{format}', 'get', metadata);
  }

  /**
   * Provides ids for sport events that have been updated in the last 24 hours.
   *
   * @summary Sport Events Updated
   */
  soccerSportEventsUpdated(metadata: types.SoccerSportEventsUpdatedMetadataParam): Promise<FetchResponse<200, types.SoccerSportEventsUpdatedResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/sport_events/updated.{format}', 'get', metadata);
  }

  /**
   * Provides a form table of game results and splits for a given season. Table displays
   * W/D/L (win/draw/loss) for a maximum of 6 matches for each team.
   *
   * @summary Season Form Standings
   */
  soccerSeasonFormStandings(metadata: types.SoccerSeasonFormStandingsMetadataParam): Promise<FetchResponse<200, types.SoccerSeasonFormStandingsResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/seasons/{season_id}/form_standings.{format}', 'get', metadata);
  }

  /**
   * Provides a list of scheduled matches for a given day.
   *
   * @summary Daily Schedules
   */
  soccerDailySchedules(metadata: types.SoccerDailySchedulesMetadataParam): Promise<FetchResponse<200, types.SoccerDailySchedulesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/schedules/{date}/schedules.{format}', 'get', metadata);
  }

  /**
   * Provides all upcoming scheduled matches and results for the past 30 matches for a given
   * team.
   *
   * @summary Competitor Schedules
   */
  soccerCompetitorSchedules(metadata: types.SoccerCompetitorSchedulesMetadataParam): Promise<FetchResponse<200, types.SoccerCompetitorSchedulesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/competitors/{competitor_id}/schedules.{format}', 'get', metadata);
  }

  /**
   * Provides schedules and results of the last 10 matches played for a given player.
   *
   * @summary Player Schedules
   */
  soccerPlayerSchedules(metadata: types.SoccerPlayerSchedulesMetadataParam): Promise<FetchResponse<200, types.SoccerPlayerSchedulesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/players/{player_id}/schedules.{format}', 'get', metadata);
  }

  /**
   * Provides match information for all currently live matches. This feed updates in real
   * time as matches are played. Matches appear a few minutes before kick-off and disappear a
   * few minutes after the match reaches “ended” status.
   *
   * @summary Live Schedules
   */
  soccerLiveSchedules(metadata: types.SoccerLiveSchedulesMetadataParam): Promise<FetchResponse<200, types.SoccerLiveSchedulesResponse200>> {
    return this.core.fetch('/{access_level}/v4/{language_code}/schedules/live/schedules.{format}', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { SoccerCompetitionInfoMetadataParam, SoccerCompetitionInfoResponse200, SoccerCompetitionSeasonsMetadataParam, SoccerCompetitionSeasonsResponse200, SoccerCompetitionsMetadataParam, SoccerCompetitionsResponse200, SoccerCompetitorMappingsMetadataParam, SoccerCompetitorMappingsResponse200, SoccerCompetitorMergeMappingsMetadataParam, SoccerCompetitorMergeMappingsResponse200, SoccerCompetitorProfileMetadataParam, SoccerCompetitorProfileResponse200, SoccerCompetitorSchedulesMetadataParam, SoccerCompetitorSchedulesResponse200, SoccerCompetitorSummariesMetadataParam, SoccerCompetitorSummariesResponse200, SoccerCompetitorVsCompetitorMetadataParam, SoccerCompetitorVsCompetitorResponse200, SoccerDailySchedulesMetadataParam, SoccerDailySchedulesResponse200, SoccerDailySummariesMetadataParam, SoccerDailySummariesResponse200, SoccerLeagueTimelineMetadataParam, SoccerLeagueTimelineResponse200, SoccerLiveSchedulesMetadataParam, SoccerLiveSchedulesResponse200, SoccerLiveSummariesMetadataParam, SoccerLiveSummariesResponse200, SoccerLiveTimelinesDeltaMetadataParam, SoccerLiveTimelinesDeltaResponse200, SoccerLiveTimelinesMetadataParam, SoccerLiveTimelinesResponse200, SoccerPlayerMappingsMetadataParam, SoccerPlayerMappingsResponse200, SoccerPlayerMergeMappingsMetadataParam, SoccerPlayerMergeMappingsResponse200, SoccerPlayerProfileMetadataParam, SoccerPlayerProfileResponse200, SoccerPlayerSchedulesMetadataParam, SoccerPlayerSchedulesResponse200, SoccerPlayerSummariesMetadataParam, SoccerPlayerSummariesResponse200, SoccerSeasonCompetitorsMetadataParam, SoccerSeasonCompetitorsResponse200, SoccerSeasonFormStandingsMetadataParam, SoccerSeasonFormStandingsResponse200, SoccerSeasonInfoMetadataParam, SoccerSeasonInfoResponse200, SoccerSeasonLeadersMetadataParam, SoccerSeasonLeadersResponse200, SoccerSeasonLineupsMetadataParam, SoccerSeasonLineupsResponse200, SoccerSeasonLinksMetadataParam, SoccerSeasonLinksResponse200, SoccerSeasonMissingPlayersMetadataParam, SoccerSeasonMissingPlayersResponse200, SoccerSeasonOverunderStatisticsMetadataParam, SoccerSeasonOverunderStatisticsResponse200, SoccerSeasonPlayersMetadataParam, SoccerSeasonPlayersResponse200, SoccerSeasonProbabilitiesMetadataParam, SoccerSeasonProbabilitiesResponse200, SoccerSeasonScheduleMetadataParam, SoccerSeasonScheduleResponse200, SoccerSeasonStandingsMetadataParam, SoccerSeasonStandingsResponse200, SoccerSeasonSummariesMetadataParam, SoccerSeasonSummariesResponse200, SoccerSeasonTransfersMetadataParam, SoccerSeasonTransfersResponse200, SoccerSeasonalCompetitorPlayersMetadataParam, SoccerSeasonalCompetitorPlayersResponse200, SoccerSeasonalCompetitorStatisticsMetadataParam, SoccerSeasonalCompetitorStatisticsResponse200, SoccerSeasonsMetadataParam, SoccerSeasonsResponse200, SoccerSportEventFunFactsMetadataParam, SoccerSportEventFunFactsResponse200, SoccerSportEventLineupsMetadataParam, SoccerSportEventLineupsResponse200, SoccerSportEventSummaryMetadataParam, SoccerSportEventSummaryResponse200, SoccerSportEventTimelineMetadataParam, SoccerSportEventTimelineResponse200, SoccerSportEventsCreatedMetadataParam, SoccerSportEventsCreatedResponse200, SoccerSportEventsRemovedMetadataParam, SoccerSportEventsRemovedResponse200, SoccerSportEventsUpdatedMetadataParam, SoccerSportEventsUpdatedResponse200 } from './types';
