import React, { useMemo } from "react";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";
import { isEventLive } from "utils/event";

import { usePosters } from "hooks/posters";
import { useVenueId } from "hooks/useVenueId";
import { useVenueEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { Button } from "components/atoms/Button";

import { PosterPreview } from "./components/PosterPreview";
import { PosterHallSearch } from "./components/PosterHallSearch";

import "./PosterHall.scss";

export interface PosterHallProps {
  venue: WithId<GenericVenue>;
}

export const PosterHall: React.FC<PosterHallProps> = ({ venue }) => {
  const venueId = useVenueId();
  const { isRelatedVenuesLoading, relatedVenueIds } = useRelatedVenues({
    currentVenueId: venueId,
  });
  const { events: relatedVenueEvents } = useVenueEvents({
    venueIds: relatedVenueIds,
  });

  const {
    posterVenues,
    isPostersLoaded,
    hasHiddenPosters,

    posterRelatedVenues,
    isPosterRelatedLoaded,

    increaseDisplayedPosterCount,

    searchInputValue,
    setSearchInputValue,
    liveFilter,
    setLiveFilter,
  } = usePosters(venue.id);

  const shouldShowMorePosters = isPostersLoaded && hasHiddenPosters;

  const renderedPosterPreviews = useMemo(() => {
    return posterVenues.map((posterVenue) => (
      <PosterPreview key={posterVenue.id} posterVenue={posterVenue} />
    ));
  }, [posterVenues]);

  const liveRelatedVenues = useMemo(() => {
    const liveVenueIds = relatedVenueEvents
      .filter((event) => isEventLive(event))
      .map((event) => event.venueId);
    return posterRelatedVenues.filter((posterRelatedVenue) =>
      liveVenueIds.includes(posterRelatedVenue.id)
    );
  }, [relatedVenueEvents, posterRelatedVenues]);

  const renderedPosterRelatedPreviews = useMemo(() => {
    return liveRelatedVenues.map((posterRelatedVenue) => (
      <PosterPreview
        key={posterRelatedVenue.id}
        posterVenue={posterRelatedVenue}
      />
    ));
  }, [liveRelatedVenues]);

  return (
    <div className="PosterHall">
      <div className="PosterHall__related">
        {isPosterRelatedLoaded || isRelatedVenuesLoading
          ? renderedPosterRelatedPreviews
          : "Loading..."}
      </div>
      <PosterHallSearch
        setSearchInputValue={setSearchInputValue}
        searchInputValue={searchInputValue}
        liveFilterValue={liveFilter}
        setLiveValue={setLiveFilter}
      />

      <div className="PosterHall__posters">
        {isPostersLoaded ? renderedPosterPreviews : "Loading posters"}
      </div>

      <div className="PosterHall__more-button">
        {shouldShowMorePosters && (
          <Button onClick={increaseDisplayedPosterCount}>
            Show more posters
          </Button>
        )}
      </div>
    </div>
  );
};
