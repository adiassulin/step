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
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
      //more than one day duration 
      if (request.getDuration() > TimeRange.WHOLE_DAY.duration())
      {
          return Arrays.asList();
      }

      //no meetings on this day
      if (events.isEmpty())
      {
          return Arrays.asList(TimeRange.WHOLE_DAY);
      }

      //no attendees in request
      if (request.getAttendees().isEmpty())
      {
          return Arrays.asList(TimeRange.WHOLE_DAY);
      }

      //todo: what about negative duration ? 

      List<TimeRange> notAvialableTimes = new LinkedList<>();
      for (Event e : events)
      {
          if (attendeesInEvent(e.getAttendees(), request.getAttendees()))
          {
              notAvialableTimes.add(e.getWhen());
          }
      }

      return createAvailavleTimes(notAvialableTimes, request);
    // throw new UnsupportedOperationException("TODO: Implement this method.");
  }

//TODO - implement 

  private Collection<TimeRange> createAvailavleTimes(List<TimeRange> notAvialableTimes, MeetingRequest request) {
      int currentStart = TimeRange.START_OF_DAY;
      int currentEnd;
      Collection<TimeRange> avialableTimes = new LinkedList<>();
      Collections.sort(notAvialableTimes, TimeRange.ORDER_BY_START);

      for (TimeRange eventTime: notAvialableTimes)
      {
          currentEnd = eventTime.start();
          if (request.getDuration() <= currentEnd - currentStart)
          {
              avialableTimes.add(TimeRange.fromStartDuration(currentStart, currentEnd - currentStart));
          }

          currentStart = currentStart > eventTime.end() ? currentStart : eventTime.end();
      }

      if (TimeRange.END_OF_DAY - currentStart >= request.getDuration())
      {
          avialableTimes.add(TimeRange.fromStartDuration(currentStart, TimeRange.END_OF_DAY - currentStart + 1));
      }
      return avialableTimes;
  }
  
  private boolean attendeesInEvent(Set<String> eventAtendees, Collection<String> requestAtendees)
  {
      for (String name: requestAtendees)
      {
          if (eventAtendees.contains(name)) return true;
      }
      
      return false;
  }
}
