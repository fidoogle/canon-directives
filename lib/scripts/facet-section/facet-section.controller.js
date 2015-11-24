(function() {
  'use strict';

  angular
  .module('facet.section')
  .controller('facetSectionController', facetSectionController);

  facetSectionController.$inject = ['storageService'];

  function facetSectionController(storageService) {
    var vm = this;
    vm.groupedFacets = null;

    vm.getFacetSublist = function(facet) {
      var sublist = null;
      if (facet.property!=='all') {
          var items = storageService.getCurrentItems();
          console.log('items: ',items);
          vm.groupedFacets = _.groupBy(items, facet.property);
          sublist   = _.keys( vm.groupedFacets );
          sublist = _.sortBy(sublist, sortCriteria);
      }
      return sublist;
    }
    vm.clickFacet = function(property, key, bChecked) {
      vm[property] = bChecked;
      vm[property+'key'] = key;
      buildFilter(property, key, bChecked);
      applyFilter(storageService.filterCriteria);
    }
    vm.facetGroupChecked = function(property, key) {
      return (vm[property] && vm[property+'key']!=key);
    }
    vm.resetFacetCheckboxes = function(facets) {
      _.each(facets, function(obj, index, list) {
        vm[obj.property] = false;
        console.log('obj: ', obj, ' property: ', obj.property);
      });
    }
    var sortCriteria = function(key, index, list) {
      return -(vm.groupedFacets[key].length);
    }
    var buildFilter = function(property, key, bChecked) {
      if (bChecked) {
        storageService.filterCriteria[property] = key;
      } else {
        storageService.filterCriteria = _.omit(storageService.filterCriteria, property);
      }
    }
    var applyFilter = function(pFilter) {
      storageService.setCurrentItems(_.where(storageService.getMasterData().items,pFilter));
    }
  }
}());
