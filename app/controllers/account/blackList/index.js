var blackList = Alloy.Collections.blackList;

function suppliersFetch()
{
	blackList.fetch();
}


function removeSupplier(e)
{
	var id = e.row.rowid;
	var item = blackList.get(id);
	
	item.destroy({
		success: function(){ },
		error: function(){ }
	});
}


suppliersFetch();

