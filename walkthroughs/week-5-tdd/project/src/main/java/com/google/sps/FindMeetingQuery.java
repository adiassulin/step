// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.*;
import java.util.Comparator; 

public final class FindMeetingQuery {
  /**
  * returns the available time slots given an event list and a query.
  */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
      //more than one day duration 
      if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
          return Arrays.asList();
      }

      //no meetings on this day
      if (events.isEmpty()) {
          return Arrays.asList(TimeRange.WHOLE_DAY);
      }

      //checking availability with optional attendees
      Collection<String> allAttendeesWithOptional = new HashSet<>();
      allAttendeesWithOptional.addAll(request.getAttendees());
      allAttendeesWithOptional.addAll(request.getOptionalAttendees());
      Collection<TimeRange> availableTimesWithOptionalAttendee = getAvailableTimesWithSpecificAttendeeList(events, allAttendeesWithOptional, request.getDuration());
      if (!availableTimesWithOptionalAttendee.isEmpty()) return availableTimesWithOptionalAttendee;

      //no mandatory attendees in request
      if (request.getAttendees().isEmpty()) {
          return Arrays.asList(TimeRange.WHOLE_DAY);
      }

      //todo: what about negative duration ? 
      return getAvailableTimesWithSpecificAttendeeList(events, request.getAttendees(), request.getDuration());
  }


  /**
  * returns list of the available times given a list of the not available times and a request duration.
  */
  private Collection<TimeRange> createAvailavleTimes(List<TimeRange> notAvialableTimes, long requestDuration) {
      int currentStart = TimeRange.START_OF_DAY;
      int currentEnd;
      Collection<TimeRange> avialableTimes = new LinkedList<>();
      Collections.sort(notAvialableTimes, TimeRange.ORDER_BY_START);

      for (TimeRange eventTime: notAvialableTimes) {
          currentEnd = eventTime.start();
          if (requestDuration <= currentEnd - currentStart) {
              avialableTimes.add(TimeRange.fromStartDuration(currentStart, currentEnd - currentStart));
          }

          currentStart = currentStart > eventTime.end() ? currentStart : eventTime.end();
      }

      if (TimeRange.END_OF_DAY - currentStart >= requestDuration) {
          avialableTimes.add(TimeRange.fromStartDuration(currentStart, TimeRange.END_OF_DAY - currentStart + 1));
      }
      return avialableTimes;
  }
  
  /**
  * returns true if at least one of the request atendee is in the list of eventAtendee.
  */
  private boolean attendeesInEvent(Set<String> eventAtendees, Collection<String> requestAtendees)
  {
      for (String name: requestAtendees) {
          if (eventAtendees.contains(name)) return true;
      }
      return false;
  }

  /**
  * returns the availsble times given an event list, attendees (could be with optional or without) and request duration. 
  */
  private  Collection<TimeRange> getAvailableTimesWithSpecificAttendeeList(Collection<Event> events, Collection<String> requestAtendees, long requestDuration) {
      List<TimeRange> notAvialableTimes = new LinkedList<>();
      for (Event e : events) {
          if (attendeesInEvent(e.getAttendees(), requestAtendees)) {
              notAvialableTimes.add(e.getWhen());
          }
      }
      return createAvailavleTimes(notAvialableTimes, requestDuration);
  }
}
