import React from "react";

import {
  ListItem,
  Column,
  HoverTile,
  FlexTop,
  FlexBottom,
  ArchiveButton
} from "./ListItem";
import { MatchesTableRowProps } from "../matches/types";
import { DEFAULT_TILE } from "../../../shared/constants";
import ManaCost from "../ManaCost";
import { getReadableEvent, toMMSS } from "../../../shared/util";
import RankSmall from "../RankSmall";
import { TagBubble, NewTag } from "../display";

export default function MatchesTable({
  row,
  archiveCallback,
  openMatchCallback,
  addTagCallback,
  editTagCallback,
  deleteTagCallback,
  tags
}: MatchesTableRowProps): JSX.Element {
  const match = row.original;
  const parentId = match.id ?? "";

  const onRowClick = (): void => {
    openMatchCallback(parentId);
  };

  const [hover, setHover] = React.useState(false);
  const mouseEnter = React.useCallback(() => {
    setHover(true);
  }, []);
  const mouseLeave = React.useCallback(() => {
    setHover(false);
  }, []);

  const onThePlay = match.player.seat == match.onThePlay ? true : false;

  return (
    <ListItem
      click={onRowClick}
      mouseEnter={mouseEnter}
      mouseLeave={mouseLeave}
    >
      <HoverTile
        hover={hover}
        grpId={match.playerDeck.deckTileId || DEFAULT_TILE}
      />

      <Column class="list_item_left">
        <FlexTop>
          <div className="list_deck_name">{match.playerDeck.name || ""}</div>
          <div className="list_deck_name_it">
            {getReadableEvent(match.eventId)}
          </div>
        </FlexTop>
        <FlexBottom>
          <ManaCost class="mana_s20" colors={match.playerDeck.colors || []} />
        </FlexBottom>
      </Column>

      <Column style={{ flexGrow: 1 }} class="list_item_right">
        <FlexTop>
          <div className="list_match_title">
            {"vs " + match.opponent.name.slice(0, -6)}
          </div>
          <RankSmall rank={match.opponent}></RankSmall>
        </FlexTop>
        <FlexBottom style={{ alignItems: "center" }}>
          <div className="list_match_time">
            <relative-time datetime={new Date(match.date).toISOString()}>
              {match.date.toString()}
            </relative-time>{" "}
            {" " + toMMSS(match.duration) + " long"}
          </div>

          <ManaCost class="mana_s20" colors={match.oppDeck.colors || []} />

          {match.tags && match.tags.length ? (
            match.tags.map((tag: any) => {
              return (
                <TagBubble
                  key={tag}
                  tag={tag}
                  parentId={match.id}
                  editTagCallback={editTagCallback}
                  deleteTagCallback={deleteTagCallback}
                />
              );
            })
          ) : (
            <NewTag
              tagPrompt="Add"
              tags={tags}
              addTagCallback={addTagCallback}
              parentId={match.id}
            />
          )}
        </FlexBottom>
      </Column>

      <div
        title={onThePlay ? "On the play" : "On the draw"}
        className={onThePlay ? "ontheplay" : "onthedraw"}
      />

      <Column class="list_match_result">
        <div
          className={match.player.win > match.opponent.win ? "green" : "red"}
        >
          {match.player.win}:{match.opponent.win}
        </div>
      </Column>

      <ArchiveButton
        archiveCallback={archiveCallback}
        dataId={match.id || ""}
        hover={hover}
        isArchived={match.archived || false}
      />
    </ListItem>
  );
}
