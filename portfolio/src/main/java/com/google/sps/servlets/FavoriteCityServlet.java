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

package com.google.sps.servlets;
import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*; 

/** Servlet that returns the city ranking*/
@WebServlet("/favorite-city-data")
public class FavoriteCityServlet extends HttpServlet {

    public static final String SURVEY_ENTITY = "Survey";
    public static final String NAME_PROPERTY = "name";
    public static final String SCORE_PROPERTY = "score";
    public static final String JSON_TYPE_RESPONSE = "application/json";
    public static final String ISLAND_PARAM = "island";
    public static final String INDEX_HTML = "/index.html";

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query(SURVEY_ENTITY);
    PreparedQuery results = datastore.prepare(query);

    LinkedHashMap<String, Long> favIsland = new LinkedHashMap<>();
    for (Entity island : results.asIterable()) {
        favIsland.put((String) island.getProperty(NAME_PROPERTY), (long)(island.getProperty(SCORE_PROPERTY)));
    }

    response.setContentType(JSON_TYPE_RESPONSE);
    Gson gson = new Gson();
    String json = gson.toJson(favIsland);
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String isle = request.getParameter(ISLAND_PARAM);
    boolean changed = false;

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query(SURVEY_ENTITY);
    PreparedQuery results = datastore.prepare(query);

    for (Entity island : results.asIterable()) {
      if (((String)island.getProperty(NAME_PROPERTY)).equals(isle)) {
          changed = true;
          island.setProperty(SCORE_PROPERTY, (long)island.getProperty(SCORE_PROPERTY) + 1);
          datastore.put(island);
      }
    }

    if (!changed) {
      Entity entity = new Entity(SURVEY_ENTITY);
      entity.setProperty(NAME_PROPERTY, isle);
      entity.setProperty(SCORE_PROPERTY, 1);
      datastore.put(entity);
    }
    //redirect
    response.sendRedirect(INDEX_HTML);
  }
}

