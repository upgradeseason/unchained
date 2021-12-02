import React from "react";
import { Switch, Route } from "react-router-dom";

import { IndexLists } from "./components/Lists/IndexLists";
import { NewList } from "./components/Lists/NewList";
import { ShowList } from "./components/Lists/ShowList";

import { IndexAddresses } from "./components/Addresses/IndexAddresses";
import { ShowAddress } from "./components/Addresses/ShowAddress";

import { NotFound } from "./components/NotFound";

export const Routes = (
  <Switch>
    <Route exact path="/" component={IndexLists} />
    <Route path="/lists/new" component={NewList} />
    <Route path="/lists/:list_id" component={ShowList} />

    <Route path="/addresses/:value" component={ShowAddress} />
    <Route path="/addresses" component={IndexAddresses} />

    <Route path="*" component={NotFound} />
  </Switch>
);
